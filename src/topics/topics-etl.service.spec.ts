// topics-etl.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { DiscourseService } from '@app/discourse';
import { TopicsEtlService } from './topics-etl.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { BaseEtlService } from '../base-etl/base-etl.service';

describe('TopicsEtlService', () => {
  let service: TopicsEtlService;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;

  beforeEach(async () => {
    mockDiscourseService = {
      getLatestTopics: jest.fn(),
    };

    mockBaseTransformerService = {};
    mockNeo4jService = {};

    const module: TestingModule = await Test.createTestingModule({
      // imports: [BaseEtlModule],
      providers: [
        BaseEtlService,
        TopicsEtlService,
        {
          provide: DiscourseService,
          useValue: mockDiscourseService,
        },
        {
          provide: BaseTransformerService,
          useValue: mockBaseTransformerService,
        },
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    service = module.get<TopicsEtlService>(TopicsEtlService);
  });

  describe('extract', () => {
    it('should extract all topics from the given forum', async () => {
      // Arrange
      const etlDto: EtlDto = {
        forum: {
          endpoint: 'some-endpoint',
          uuid: 'test-uuid',
        },
        cypher: '',
      };
      const job: Job<EtlDto> = { data: etlDto } as Job<EtlDto>;
      const topics: Partial<Topic>[] = [{ id: 1 }];

      // Assume the total_rows_topics is 1 for simplicity
      mockDiscourseService.getLatestTopics.mockResolvedValue({
        data: { topic_list: { topics } },
      });

      // Act
      const result = await service.extract(job);

      // Assert
      expect(mockDiscourseService.getLatestTopics).toHaveBeenCalledWith(
        'some-endpoint',
        0,
        'created',
      );
      expect(result).toEqual(topics);
    });
    it('should concatenate group data across multiple pages', async () => {
      const etlDto: EtlDto = {
        forum: {
          endpoint: 'endpoint',
          uuid: 'test-uuid',
        },
        cypher: '',
      };
      const job: Job<EtlDto> = { data: etlDto } as unknown as Job<EtlDto>;

      const topicsPage1: Partial<Topic>[] = [{ id: 1 }];
      const topicsPage2: Partial<Topic>[] = [{ id: 2 }];
      const topicsPage3: Partial<Topic>[] = [{ id: 3 }];

      mockDiscourseService.getLatestTopics.mockImplementation(
        async (endpoint, page) => {
          if (page === 0) {
            return {
              data: {
                topic_list: {
                  topics: topicsPage1,
                  more_topics_url: 'test-url',
                },
              },
            }; // Indicate more topics are present
          } else if (page === 1) {
            return {
              data: {
                topic_list: {
                  topics: topicsPage2,
                  more_topics_url: 'test-url',
                },
              },
            }; // Last page
          } else {
            return {
              data: {
                topic_list: {
                  topics: topicsPage3,
                },
              },
            }; // No more topics
          }
        },
      );

      const result = await service.extract(job);

      expect(mockDiscourseService.getLatestTopics).toHaveBeenCalledTimes(3);
      expect(mockDiscourseService.getLatestTopics).toHaveBeenCalledWith(
        'endpoint',
        0,
        'created',
      );
      expect(mockDiscourseService.getLatestTopics).toHaveBeenCalledWith(
        'endpoint',
        1,
        'created',
      );
      expect(mockDiscourseService.getLatestTopics).toHaveBeenCalledWith(
        'endpoint',
        2,
        'created',
      );
      expect(result.length).toBe(3); // total_rows_topics is 3, so we expect an array of 3 topics
      expect(result).toEqual([...topicsPage1, ...topicsPage2, ...topicsPage3]); // Expect the concatenated result
    });
  });
});

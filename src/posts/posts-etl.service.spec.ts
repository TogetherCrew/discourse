// topics-etl.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { DiscourseService } from '@app/discourse';
import { PostsEtlService } from './posts-etl.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { FLOWS } from '../constants/flows.constants';

describe('PostsEtlService', () => {
  let service: PostsEtlService;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;
  let mockFlowProducer: any;

  beforeEach(async () => {
    mockDiscourseService = {
      getPosts: jest.fn(),
    };

    mockBaseTransformerService = {};
    mockNeo4jService = {};
    mockFlowProducer = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      // imports: [BaseEtlModule],
      providers: [
        BaseEtlService,
        PostsEtlService,
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
        {
          provide: `BullFlowProducer_${FLOWS.POST_TL}`,
          useValue: mockFlowProducer,
        },
      ],
    }).compile();

    service = module.get<PostsEtlService>(PostsEtlService);
  });

  describe('extract', () => {
    it('should extract all posts from the given topic', async () => {
      // Arrange
      const etlDto: EtlDto = {
        forum: {
          endpoint: 'some-endpoint',
          uuid: 'test-uuid',
        },
        cypher: '',
      };
      const job: Partial<Job> = {
        data: etlDto,
        getChildrenValues: jest.fn().mockReturnValue([[{ id: 1 }, { id: 2 }]]),
      };
      const posts: Partial<Post>[] = [{ id: 1 }];

      // Assume the total_rows_topics is 1 for simplicity
      mockDiscourseService.getPosts.mockResolvedValue({
        data: { post_stream: { posts } },
      });

      // Act
      await service.extract(job as Job);

      // Assert
      expect(mockDiscourseService.getPosts).toHaveBeenCalledWith(
        'some-endpoint',
        1,
      );
      expect(mockFlowProducer.add).toHaveBeenCalled();
    });
  });
});

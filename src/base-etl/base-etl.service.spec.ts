import { Test, TestingModule } from '@nestjs/testing';
import { BaseEtlService } from './base-etl.service';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { Job } from 'bullmq';
import { EtlDto } from './dto/etl.dto';
import { AxiosResponse } from 'axios';

describe('BaseEtlService', () => {
  let service: BaseEtlService;
  let discourseService: DiscourseService;
  let baseTransformerService: BaseTransformerService;
  let neo4jService: Neo4jService;

  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;

  beforeEach(async () => {
    mockDiscourseService = {
      getBadges: jest.fn(),
    };
    mockBaseTransformerService = {
      transform: jest.fn(),
    };
    mockNeo4jService = {
      write: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseEtlService,
        DiscourseService,
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

    service = module.get<BaseEtlService>(BaseEtlService);
    discourseService = module.get<DiscourseService>(DiscourseService);
    baseTransformerService = module.get<BaseTransformerService>(
      BaseTransformerService,
    );
    neo4jService = module.get<Neo4jService>(Neo4jService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extract method', () => {
    it('should extract data using the Discourse service', async () => {
      const job = {
        data: {
          forum: { endpoint: 'endpoint' },
          operation: 'getBadges',
          property: 'badges',
        },
      };
      const mockBadges = [{ id: 1 }] as Badge[];
      jest.spyOn(discourseService, 'getBadges').mockResolvedValueOnce({
        data: { badges: mockBadges },
      } as AxiosResponse<BadgesResponse>);

      const result = await service.extract(job as Job<EtlDto, any, string>);
      console.log(result);

      expect(discourseService.getBadges).toHaveBeenCalledWith('endpoint');
      expect(result).toEqual(mockBadges);
    });
  });

  describe('transform method', () => {
    it('should call transform for each item with the correct parameters', async () => {
      // Arrange
      const forumUuid = 'test-forum-uuid';
      const inputData = {
        forum: { uuid: forumUuid },
      };
      const childrenValues = [
        { id: 1, badge_grouping_id: 3 },
        { id: 2, badge_grouping_id: 4 },
      ];
      const job = {
        data: inputData,
        getChildrenValues: jest.fn().mockResolvedValue({ key: childrenValues }),
      } as Partial<Job>;

      console.log(await job.getChildrenValues());

      const transformedValue = { id: 1, badgeGroupingId: 3, forumUuid };
      mockBaseTransformerService.transform.mockReturnValue(transformedValue);

      // Act
      const result = await service.transform(job as Job);

      // Assert
      expect(job.getChildrenValues).toHaveBeenCalled();
      expect(baseTransformerService.transform).toHaveBeenCalledTimes(
        childrenValues.length,
      );
      expect(baseTransformerService.transform).toHaveBeenCalledWith(
        childrenValues[0],
        {
          forum_uuid: forumUuid,
        },
      );
      expect(result[0]).toEqual(transformedValue);
    });

    it('should handle an empty array of children values', async () => {
      // Arrange
      const inputData = {
        forum: { uuid: 'test-forum-uuid' },
        // other job data as needed
      };
      const childrenValues = [];
      const job = {
        data: inputData,
        getChildrenValues: jest.fn().mockResolvedValue({ key: childrenValues }),
      };

      // Act
      const result = await service.transform(
        job as unknown as Job<any, any, string>,
      );

      // Assert
      expect(job.getChildrenValues).toHaveBeenCalled();
      expect(baseTransformerService.transform).not.toHaveBeenCalled(); // No transformation should be called on an empty array
      expect(result).toEqual([]); // Result should also be an empty array
    });
  });

  describe('load method', () => {
    it('should write to the neo4j database using the provided cypher query and batch data', async () => {
      // Arrange
      const cypherQuery = 'CREATE (n:Forum {id: $batch.id, name: $batch.name})';
      const batchData = [{ id: '123', name: 'Test Forum' }];
      const jobData = { cypher: cypherQuery, batch: batchData };
      const jobMock = {
        data: jobData,
        getChildrenValues: jest.fn().mockResolvedValue({ key: batchData }),
      };

      // Act
      await service.load(jobMock as unknown as Job<any, any, string>);

      // Assert
      expect(neo4jService.write).toHaveBeenCalledWith(cypherQuery, {
        batch: batchData,
      });
    });
  });
});

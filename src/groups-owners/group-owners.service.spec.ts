import { TestingModule, Test } from '@nestjs/testing';
import { FlowProducer } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';
import { DiscourseService } from '@app/discourse';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { GroupOwnersService } from './group-owners.service';

describe('GroupOwnersService', () => {
  let service: GroupOwnersService;
  let mockDiscourseService: jest.Mocked<DiscourseService>;
  let mockNeo4jService: jest.Mocked<Neo4jService>;
  let mockFlowProducer: jest.Mocked<FlowProducer>;

  beforeEach(async () => {
    mockNeo4jService = {
      write: jest.fn(),
    } as unknown as jest.Mocked<Neo4jService>;
    mockFlowProducer = {
      add: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupOwnersService,
        BaseTransformerService,
        {
          provide: DiscourseService,
          useValue: mockDiscourseService,
        },
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
        {
          provide: `BullFlowProducer_${FLOW_PRODUCER}`,
          useValue: mockFlowProducer,
        },
      ],
    }).compile();

    service = module.get<GroupOwnersService>(GroupOwnersService);
  });

  describe('transform method', () => {
    it('should process data and add a job to the flowProducer', async () => {
      const mockJob = {
        data: {
          forum: { uuid: 'test-uuid' },
          owners: [{ id: 1 }, { id: 2 }],
          group: { id: 1 },
        },
      };

      await service.transform(mockJob as any);

      expect(mockFlowProducer.add).toHaveBeenCalledWith({
        queueName: QUEUES.LOAD,
        name: JOBS.GROUP_OWNER,
        data: {
          batch: [
            { id: 1, forumUuid: 'test-uuid' },
            { id: 2, forumUuid: 'test-uuid' },
          ],
          groupId: 1,
        },
      });
    });
  });

  describe('load method', () => {
    it('should call neo4jService.write with correct parameters', async () => {
      const mockJob = {
        data: {
          batch: [], // Replace with actual mock data
        },
      };
      await service.load(mockJob as any);
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.BULK_CREATE_GROUP_OWNERS,
        mockJob.data,
      );
    });
  });
});

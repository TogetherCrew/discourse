import { TestingModule, Test } from '@nestjs/testing';
import { FlowProducer } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';
import { DiscourseService } from '@app/discourse';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockDiscourseService: jest.Mocked<DiscourseService>;
  let mockNeo4jService: jest.Mocked<Neo4jService>;
  let mockFlowProducer: jest.Mocked<FlowProducer>;

  beforeEach(async () => {
    mockNeo4jService = {
      write: jest.fn(),
    } as unknown as jest.Mocked<Neo4jService>;
    mockFlowProducer = {
      add: jest.fn(),
      addBulk: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
        {
          provide: `BullQueue_EXTRACT`,
          useValue: {
            getJobs: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('transform method', () => {
    it('should process data and add a job to the flowProducer', async () => {
      const forum = { uuid: 'test-uuid' };
      const mockJob = {
        data: {
          forum,
          users: [{ id: 1 }, { id: 2 }],
        },
      };

      await service.transform(mockJob as any);

      const batch = [
        { id: 1, forumUuid: 'test-uuid' },
        { id: 2, forumUuid: 'test-uuid' },
      ];

      expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
        {
          queueName: QUEUES.USER,
          name: JOBS.LOAD,
          data: {
            batch,
          },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTIONS,
          data: {
            user: batch[0],
            forum,
          },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTIONS,
          data: {
            user: batch[1],
            forum,
          },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_BADGES,
          data: {
            user: batch[0],
            forum,
          },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_BADGES,
          data: {
            user: batch[1],
            forum,
          },
        },
      ]);
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
        CYPHERS.BULK_CREATE_USER,
        mockJob.data,
      );
    });
  });
});

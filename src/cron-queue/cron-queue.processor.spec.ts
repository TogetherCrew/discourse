import { Test, TestingModule } from '@nestjs/testing';
import { CronQueueProcessor } from './cron-queue.processor';
import { FlowProducer, Queue } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { OrchestrationService } from '../orchestration/orchestration.service';

describe('CronQueueService', () => {
  let processor: CronQueueProcessor;
  let mockNeo4jService: jest.Mocked<Neo4jService>;
  let mockFlowProducer: jest.Mocked<FlowProducer>;
  let mockQueue: jest.Mocked<Queue>;
  let mockOrchestrationService: jest.Mocked<OrchestrationService>;

  beforeEach(async () => {
    mockNeo4jService = {
      write: jest.fn(),
    } as unknown as jest.Mocked<Neo4jService>;
    mockFlowProducer = {
      add: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;
    mockQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<Queue>;
    mockOrchestrationService = {
      run: jest.fn(),
    } as unknown as jest.Mocked<OrchestrationService>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronQueueProcessor,
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
        {
          provide: `BullFlowProducer_${FLOW_PRODUCER}`,
          useValue: mockFlowProducer,
        },
        {
          provide: `BullQueue_${QUEUES.CRON}`,
          useValue: mockQueue,
        },
        {
          provide: OrchestrationService,
          useValue: mockOrchestrationService,
        },
      ],
    }).compile();

    processor = module.get<CronQueueProcessor>(CronQueueProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

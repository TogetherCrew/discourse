import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { TopicsProcessor } from './topics.processor';
import { TopicsService } from './topics.service';

describe('TopicsProcessor', () => {
  let processor: TopicsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsProcessor,
        TopicsService,
        {
          provide: DiscourseService,
          useValue: jest.fn(),
        },
        {
          provide: BaseTransformerService,
          useValue: jest.fn(),
        },
        {
          provide: Neo4jService,
          useValue: jest.fn(),
        },
        {
          provide: `BullFlowProducer_${FLOW_PRODUCER}`,
          useValue: jest.fn(),
        },
        {
          provide: `BullQueue_EXTRACT`,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    processor = module.get<TopicsProcessor>(TopicsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

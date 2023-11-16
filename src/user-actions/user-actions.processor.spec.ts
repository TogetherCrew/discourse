import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { UserActionsProcessor } from './user-actions.processor';
import { UserActionsService } from './user-actions.service';

describe('UserActionsProcessor', () => {
  let processor: UserActionsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActionsProcessor,
        UserActionsService,
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

    processor = module.get<UserActionsProcessor>(UserActionsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

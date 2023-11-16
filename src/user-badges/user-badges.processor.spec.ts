import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { UserBadgesProcessor } from './user-badges.processor';
import { UserBadgesService } from './user-badges.service';

describe('UserBadgesProcessor', () => {
  let processor: UserBadgesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBadgesProcessor,
        UserBadgesService,
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

    processor = module.get<UserBadgesProcessor>(UserBadgesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

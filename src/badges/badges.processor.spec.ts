import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { BadgesProcessor } from './badges.processor';
import { BadgesService } from './badges.service';

describe('BadgesProcessor', () => {
  let processor: BadgesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesProcessor,
        BadgesService,
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
      ],
    }).compile();

    processor = module.get<BadgesProcessor>(BadgesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

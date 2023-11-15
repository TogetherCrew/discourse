import { Test, TestingModule } from '@nestjs/testing';
import { BadgeGroupingsProcessor } from './badge-groupings.processor';
import { BadgeGroupingsService } from './badge-groupings.service';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';

describe('BadgeGroupingsService', () => {
  let processor: BadgeGroupingsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeGroupingsProcessor,
        BadgeGroupingsService,
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

    processor = module.get<BadgeGroupingsProcessor>(BadgeGroupingsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

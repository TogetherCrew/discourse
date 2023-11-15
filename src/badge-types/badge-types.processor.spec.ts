import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesProcessor } from './badge-types.processor';
import { BadgeTypesService } from './badge-types.service';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

describe('BadgeGroupingsService', () => {
  let processor: BadgeTypesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeTypesProcessor,
        BadgeTypesService,
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

    processor = module.get<BadgeTypesProcessor>(BadgeTypesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

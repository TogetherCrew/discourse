import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { TagGroupsProcessor } from './tag-groups.processor';
import { TagGroupsService } from './tag-groups.service';

describe('TagGroupsProcessor', () => {
  let processor: TagGroupsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagGroupsProcessor,
        TagGroupsService,
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

    processor = module.get<TagGroupsProcessor>(TagGroupsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

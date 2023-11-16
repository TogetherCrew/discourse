import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { GroupsProcessor } from './groups.processor';
import { GroupsService } from './groups.service';

describe('GroupsProcessor', () => {
  let processor: GroupsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsProcessor,
        GroupsService,
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

    processor = module.get<GroupsProcessor>(GroupsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

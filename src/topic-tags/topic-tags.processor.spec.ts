import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from '@app/discourse';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { TopicTagsProcessor } from './topic-tags.processor';
import { TopicTagsService } from './topic-tags.service';

describe('TopicTagsProcessor', () => {
  let processor: TopicTagsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicTagsProcessor,
        TopicTagsService,
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

    processor = module.get<TopicTagsProcessor>(TopicTagsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

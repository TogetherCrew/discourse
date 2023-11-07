import { Test, TestingModule } from '@nestjs/testing';
import { TopicsProcessor } from './topics.processor';
import { TopicsEtlService } from './topics-etl.service';
import { FLOWS } from '../constants/flows.constants';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';

jest.mock('../base-etl/base-etl.service');

describe('TopicsProcessor', () => {
  let processor: TopicsProcessor;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;
  let mockFlowProducer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseEtlService,
        TopicsEtlService,
        TopicsProcessor,
        {
          provide: DiscourseService,
          useValue: mockDiscourseService,
        },
        {
          provide: BaseTransformerService,
          useValue: mockBaseTransformerService,
        },
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
        {
          provide: `BullFlowProducer_${FLOWS.TOPIC_TL}`,
          useValue: mockFlowProducer,
        },
      ],
    }).compile();

    processor = module.get<TopicsProcessor>(TopicsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

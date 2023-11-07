import { Test, TestingModule } from '@nestjs/testing';
import { PostsProcessor } from './posts.processor';
import { PostsEtlService } from './posts-etl.service';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOWS } from '../constants/flows.constants';

jest.mock('../base-etl/base-etl.service');

describe('PostsProcessor', () => {
  let processor: PostsProcessor;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;
  let mockFlowProducer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsProcessor,
        BaseEtlService,
        PostsEtlService,
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
          provide: `BullFlowProducer_${FLOWS.POST_TL}`,
          useValue: mockFlowProducer,
        },
      ],
    }).compile();

    processor = module.get<PostsProcessor>(PostsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

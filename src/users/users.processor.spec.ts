import { Test, TestingModule } from '@nestjs/testing';
import { UsersProcessor } from './users.processor';
import { UsersEtlService } from './users.module';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOWS } from '../constants/flows.constants';

jest.mock('../base-etl/base-etl.service');

describe('UsersProcessor', () => {
  let processor: UsersProcessor;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;
  let mockFlowProducer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersProcessor,
        BaseEtlService,
        UsersEtlService,
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

    processor = module.get<UsersProcessor>(UsersProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

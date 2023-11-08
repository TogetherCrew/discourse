// topics-etl.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { DiscourseService } from '@app/discourse';
import { UsersEtlService } from './users-etl.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { FLOWS } from '../constants/flows.constants';

describe('UsersEtlService', () => {
  let service: UsersEtlService;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;
  let mockFlowProducer: any;

  beforeEach(async () => {
    mockDiscourseService = {
      getPosts: jest.fn(),
    };

    mockBaseTransformerService = {};
    mockNeo4jService = {};
    mockFlowProducer = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      // imports: [BaseEtlModule],
      providers: [
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

    service = module.get<UsersEtlService>(UsersEtlService);
  });

  describe('transform', () => {});
});

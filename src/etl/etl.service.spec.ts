import { DiscourseService } from '@app/discourse';
import { FlowProducer, Job } from 'bullmq';
import { BaseTransformerService } from 'src/base-transformer/base-transformer.service';
import { EtlService } from './etl.service';
import { Neo4jService } from 'nest-neo4j';
import { Test, TestingModule } from '@nestjs/testing';

class MockEtlService extends EtlService {
  constructor(
    discourseService: DiscourseService,
    baseTransformerService: BaseTransformerService,
    neo4jService: Neo4jService,
    flowProducer: FlowProducer,
  ) {
    super(discourseService, baseTransformerService, neo4jService, flowProducer);
  }

  extract(job: Job) {
    return job.id;
  }

  transform(job: Job) {
    return job.id;
  }

  load(job: Job) {
    return job.id;
  }
}

describe('EtlService', () => {
  let service: EtlService;
  let mockDiscourseService: jest.Mocked<DiscourseService>;
  let mockBaseTransformerService: jest.Mocked<BaseTransformerService>;
  let mockNeo4jService: jest.Mocked<Neo4jService>;
  let mockFlowProducer: jest.Mocked<FlowProducer>;

  const job = jest.fn().mockReturnValue({ id: 1 }) as Partial<Job>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EtlService,
          useValue: new MockEtlService(
            mockDiscourseService,
            mockBaseTransformerService,
            mockNeo4jService,
            mockFlowProducer,
          ),
        },
      ],
    }).compile();

    service = module.get<EtlService>(EtlService) as MockEtlService;
  });

  it('should be properly instantiated', () => {
    expect(service).toBeDefined();
  });
  describe('extract method', () => {
    it('should call extract method with correct parameters', () => {
      expect(service.extract(job as Job)).toEqual(1);
      expect(service.extract).toHaveBeenCalled();
    });
  });

  describe('transform method', () => {
    it('should call transform method with correct parameters', () => {
      expect(service.transform(job as Job)).toEqual(1);
      expect(service.transform).toHaveBeenCalled();
    });
  });

  describe('load method', () => {
    it('should call load method with correct parameters', () => {
      expect(service.load(job as Job)).toEqual(1);
      expect(service.load).toHaveBeenCalled();
    });
  });
});

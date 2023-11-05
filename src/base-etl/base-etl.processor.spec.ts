import { Test } from '@nestjs/testing';
import { BaseEtlSchemaService } from './base-etl.service';
import { Job } from 'bullmq';
import { BaseEtlProcessor } from './base-etl.processor';
import { JOBS } from '../constants/jobs.contants';
import { EtlDto } from './dto/etl.dto';

describe('BaseEtlProcessor', () => {
  let processor: BaseEtlProcessor;
  let service: BaseEtlSchemaService;

  let mockService: any;

  beforeEach(async () => {
    mockService = {
      extract: jest.fn(),
      transform: jest.fn(),
      load: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BaseEtlSchemaService,
          useValue: mockService,
        },
        BaseEtlProcessor,
      ],
    }).compile();

    service = moduleRef.get<BaseEtlSchemaService>(BaseEtlSchemaService);
    processor = new (class extends BaseEtlProcessor {})(service);
  });

  it('should process extract job', async () => {
    const job = { name: JOBS.EXTRACT, queueName: 'testQueue' } as Job<
      EtlDto,
      any,
      string
    >;
    await processor.process(job);
    expect(service.extract).toHaveBeenCalledWith(job);
  });

  it('should process transform job', async () => {
    const job = { name: JOBS.TRANSFORM, queueName: 'testQueue' } as Job<
      EtlDto,
      any,
      string
    >;
    await processor.process(job);
    expect(service.transform).toHaveBeenCalledWith(job);
  });

  it('should process load job', async () => {
    const job = { name: JOBS.LOAD, queueName: 'testQueue' } as Job<
      EtlDto,
      any,
      string
    >;
    await processor.process(job);
    expect(service.load).toHaveBeenCalledWith(job);
  });

  it('should not process an unknown job', async () => {
    const job = { name: 'unknown', queueName: 'testQueue' } as Job<
      EtlDto,
      any,
      string
    >;
    await processor.process(job);
    expect(service.extract).not.toHaveBeenCalled();
    expect(service.transform).not.toHaveBeenCalled();
    expect(service.load).not.toHaveBeenCalled();
  });
});

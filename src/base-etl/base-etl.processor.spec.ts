import { Test } from '@nestjs/testing';
import { Job } from 'bullmq';
import { BaseEtlProcessor } from './base-etl.processor';
import { JOBS } from '../constants/jobs.contants';
import { EtlService } from '../etl/etl.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';
describe('BaseEtlProcessor', () => {
  let processor: BaseEtlProcessor;
  let mockService: jest.Mocked<EtlService>;

  beforeEach(async () => {
    mockService = {
      extract: jest.fn(),
      transform: jest.fn(),
      load: jest.fn(),
    } as unknown as jest.Mocked<EtlService>;

    const module = await Test.createTestingModule({
      providers: [
        BaseEtlProcessor,
        {
          provide: EtlService,
          useValue: mockService,
        },
        {
          provide: `BullFlowProducer_${FLOW_PRODUCER}`,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    processor = module.get<BaseEtlProcessor>(BaseEtlProcessor);
    console.log('processor', processor);
  });

  it('should process extract job', async () => {
    const job = { name: JOBS.EXTRACT, queueName: 'testQueue' } as Job<
      any,
      any,
      string
    >;
    await processor.process(job);
    expect(mockService.extract).toHaveBeenCalledWith(job);
  });

  it('should process transform job', async () => {
    const job = { name: JOBS.TRANSFORM, queueName: 'testQueue' } as Job<
      any,
      any,
      string
    >;
    await processor.process(job);
    expect(mockService.transform).toHaveBeenCalledWith(job);
  });

  it('should process load job', async () => {
    const job = { name: JOBS.LOAD, queueName: 'testQueue' } as Job<
      any,
      any,
      string
    >;
    await processor.process(job);
    expect(mockService.load).toHaveBeenCalledWith(job);
  });

  it('should not process an unknown job', async () => {
    const job = { name: 'unknown', queueName: 'testQueue' } as Job<
      any,
      any,
      string
    >;
    await processor.process(job);
    expect(mockService.extract).not.toHaveBeenCalled();
    expect(mockService.transform).not.toHaveBeenCalled();
    expect(mockService.load).not.toHaveBeenCalled();
  });
});

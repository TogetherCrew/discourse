import { Test, TestingModule } from '@nestjs/testing';
import { FlowJob } from 'bullmq';
import { EtlService } from './etl.service';
import { JOBS } from '../constants/jobs.contants';

describe('EtlService', () => {
  let etlService: EtlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtlService],
    }).compile();

    etlService = module.get<EtlService>(EtlService);
  });

  it('should be defined', () => {
    expect(etlService).toBeDefined();
  });

  describe('etl', () => {
    it('should create a load job with transform and extract children', () => {
      const queue = 'testQueue';
      const data = { key: 'value' };
      const childrenJobs: FlowJob[] = [
        { name: 'childJob', queueName: 'childQueue', data: {} },
      ];

      const job = etlService.etl(queue, data, childrenJobs);

      expect(job).toEqual({
        name: JOBS.LOAD,
        queueName: queue,
        data,
        children: [
          {
            name: JOBS.TRANSFORM,
            queueName: queue,
            data,
            children: [
              {
                name: JOBS.EXTRACT,
                queueName: queue,
                data,
                children: childrenJobs,
              },
            ],
          },
        ],
      });
    });

    it('should create a load job without children when none are provided', () => {
      const queue = 'testQueue';
      const data = { key: 'value' };

      const job = etlService.etl(queue, data);

      expect(job).toEqual({
        name: JOBS.LOAD,
        queueName: queue,
        data,
        children: [
          {
            name: JOBS.TRANSFORM,
            queueName: queue,
            data,
            children: [
              {
                name: JOBS.EXTRACT,
                queueName: queue,
                data,
                children: [],
              },
            ],
          },
        ],
      });
    });
  });
});

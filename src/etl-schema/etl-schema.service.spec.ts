import { Test, TestingModule } from '@nestjs/testing';
import { FlowJob } from 'bullmq';
import { EtlSchemaService } from './etl-schema.service';
import { JOBS } from '../constants/jobs.contants';
import { EtlDto } from '../base-etl/dto/etl.dto';

describe('EtlSchemaService', () => {
  let etlService: EtlSchemaService;

  const data: EtlDto = {
    forum: {
      uuid: 'test-uuid',
      endpoint: 'endpoint',
    },
    operation: 'getBadges',
    property: 'badges',
    cypher: 'TEXT',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtlSchemaService],
    }).compile();

    etlService = module.get<EtlSchemaService>(EtlSchemaService);
  });

  it('should be defined', () => {
    expect(etlService).toBeDefined();
  });

  describe('etl', () => {
    it('should create a load job with transform and extract children', () => {
      const queue = 'testQueue';
      const childrenJobs: FlowJob[] = [
        { name: 'childJob', queueName: 'childQueue', data },
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

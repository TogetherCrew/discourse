import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOBS } from '../constants/jobs.contants';
import { EtlService } from '../etl/etl.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseEtlProcessor extends WorkerHost {
  constructor(private readonly service: EtlService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(job.queueName, job.name);
    switch (job.name) {
      case JOBS.EXTRACT:
        return this.service.extract(job);
      case JOBS.TRANSFORM:
        return this.service.transform(job);
      case JOBS.LOAD:
        return await this.service.load(job);
      default:
        break;
    }
  }
}

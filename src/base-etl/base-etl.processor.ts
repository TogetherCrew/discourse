import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOBS } from '../constants/jobs.contants';
import { BaseEtlSchemaService } from './base-etl.service';
import { EtlDto } from './dto/etl.dto';

export class BaseEtlProcessor extends WorkerHost {
  constructor(private readonly service: BaseEtlSchemaService) {
    super();
  }

  async process(job: Job<EtlDto, any, string>): Promise<any> {
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

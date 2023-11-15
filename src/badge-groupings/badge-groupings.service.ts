import { Injectable } from '@nestjs/common';
import { Forum } from '../forums/entities/forum.entity';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { Job } from 'bullmq';

type TransformDto = {
  forum: Forum;
  batch: BadgeType[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class BadgeGroupingsService extends EtlService {
  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, batch } = job.data;
    const output = batch.map((obj) =>
      this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
    );
    console.log('output', output);
    await this.flowProducer.add({
      queueName: QUEUES.BADGE_GROUPING,
      name: JOBS.LOAD,
      data: { batch: output },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_BADGE_GROUPING, job.data);
  }
}

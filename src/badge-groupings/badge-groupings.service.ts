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
    try {
      const { forum, batch } = job.data;
      const output = batch.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );

      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.BADGE_GROUPING,
        data: { batch: output },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(
        CYPHERS.BULK_CREATE_BADGE_GROUPING,
        job.data,
      );
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

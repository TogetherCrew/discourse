import { Injectable } from '@nestjs/common';
import { DiscourseService } from '@app/discourse';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FlowProducer, Job } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Forum } from '../forums/entities/forum.entity';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';

type TransformDto = {
  forum: Forum;
  batch: BadgeType[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class BadgeTypesService extends EtlService {
  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, batch } = job.data;
    const output = batch.map((obj) =>
      this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.BADGE_TYPE,
      name: JOBS.LOAD,
      data: { batch: output },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_BADGE_TYPE, job.data);
  }
}

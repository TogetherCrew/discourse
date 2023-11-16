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

type ExtractDto = {
  forum: Forum;
};

type TransformDto = ExtractDto & {
  batch: Badge[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class BadgesService extends EtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOW_PRODUCER)
    protected readonly flowProducer: FlowProducer,
  ) {
    super(discourseService, baseTransformerService, neo4jService, flowProducer);
  }

  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    try {
      const { forum } = job.data;
      const { data } = await this.discourseService.getBadges(forum.endpoint);
      const { badges, badge_types, badge_groupings } = data;

      this.flowProducer.addBulk([
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.BADGE,
          data: { forum, batch: badges },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.BADGE_GROUPING,
          data: { forum, batch: badge_groupings },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.BADGE_TYPE,
          data: { forum, batch: badge_types },
        },
      ]);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    try {
      const { forum, batch } = job.data;
      const output = batch.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.BADGE,
        data: { batch: output },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_BADGE, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

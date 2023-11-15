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
export class CategoriesService extends EtlService {
  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    try {
      const { forum } = job.data;
      const { data } = await this.discourseService.getCategories(
        forum.endpoint,
      );
      const {
        category_list: { categories },
      } = data;

      this.flowProducer.add({
        queueName: QUEUES.CATEGORY,
        name: JOBS.TRANSFORM,
        data: { forum, batch: categories },
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, batch } = job.data;
    const output = batch.map((obj) =>
      this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.CATEGORY,
      name: JOBS.LOAD,
      data: { batch: output },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_CATEGORY, job.data);
  }
}

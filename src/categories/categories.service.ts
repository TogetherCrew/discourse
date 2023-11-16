import { Injectable } from '@nestjs/common';
import { Forum } from '../forums/entities/forum.entity';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { Job } from 'bullmq';

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
        queueName: QUEUES.TRANSFORM,
        name: JOBS.CATEGORY,
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
      queueName: QUEUES.LOAD,
      name: JOBS.CATEGORY,
      data: { batch: output },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_CATEGORY, job.data);
  }
}

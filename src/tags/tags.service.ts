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
  tags: Tag[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class TagsService extends EtlService {
  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    try {
      const { forum } = job.data;
      const { data } = await this.discourseService.getTags(forum.endpoint);
      const {
        tags,
        extras: { tag_groups },
      } = data;

      this.flowProducer.addBulk([
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.TAG,
          data: { forum, tags },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.TAG_GROUP,
          data: { forum, tag_groups },
        },
      ]);
    } catch (error) {
      console.error(error.message);
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, tags } = job.data;
    const batch = tags.map((obj) =>
      this.baseTransformerService.transform(obj, {
        forum_uuid: forum.uuid,
      }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.LOAD,
      name: JOBS.TAG,
      data: { batch },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_TAG, job.data);
  }
}

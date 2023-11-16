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
  tag_groups: TagGroup[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class TagGroupsService extends EtlService {
  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, tag_groups } = job.data;
    const batch = tag_groups.map((obj) =>
      this.baseTransformerService.transform(obj, {
        forum_uuid: forum.uuid,
      }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.LOAD,
      name: JOBS.TAG_GROUP,
      data: { batch },
    });
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_TAG_GROUP, job.data);
    } catch (error) {
      console.error(error.message);
    }
  }
}

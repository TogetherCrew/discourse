import { FlowJob, Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';

import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';

type ExtractDto = {
  forum: Forum;
};

type TransformDto = ExtractDto & {
  groups: Group[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class GroupsService extends EtlService {
  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    return this.iterate(forum);
  }

  async transform(job: Job<TransformDto, any, string>) {
    const { forum, groups } = job.data;
    const batch = groups.map((obj) =>
      this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.GROUP,
      name: JOBS.LOAD,
      data: { batch },
    });
  }

  async load(job: Job<LoadDto, any, string>) {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_GROUP, job.data);
  }

  private async iterate(forum: Forum, page = 0, count = 0) {
    const { data } = await this.discourseService.getGroups(
      forum.endpoint,
      page,
    );
    const { groups, total_rows_groups }: GroupsResponse = data;

    await this.flowProducer.add({
      queueName: QUEUES.GROUP,
      name: JOBS.TRANSFORM,
      data: { forum, groups },
    });
    const jobs: FlowJob[] = groups.map((group) => ({
      queueName: QUEUES.EXTRACT,
      name: JOBS.GROUP_MEMBERS,
      data: { forum, group },
    }));
    await this.flowProducer.addBulk(jobs);

    count += groups.length;
    if (count >= total_rows_groups) {
      return;
    } else {
      return await this.iterate(forum, page + 1, count);
    }
  }
}

import { FlowJob, Job } from 'bullmq';
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
    try {
      const { forum } = job.data;
      return this.iterate(forum);
    } catch (error) {
      job.log(error.message);
    }
  }

  async transform(job: Job<TransformDto, any, string>) {
    try {
      const { forum, groups } = job.data;
      const batch = groups.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.GROUP,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>) {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_GROUP, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async iterate(forum: Forum, page = 0, count = 0) {
    try {
      const { data } = await this.discourseService.getGroups(
        forum.endpoint,
        page,
      );
      const { groups, total_rows_groups }: GroupsResponse = data;

      await this.flowProducer.add({
        queueName: QUEUES.TRANSFORM,
        name: JOBS.GROUP,
        data: { forum, groups },
      });
      const jobs: FlowJob[] = groups.map((group) => ({
        queueName: QUEUES.EXTRACT,
        name: JOBS.GROUP_MEMBER,
        data: { forum, group },
      }));
      await this.flowProducer.addBulk(jobs);

      count += groups.length;
      if (count >= total_rows_groups) {
        return;
      } else {
        return await this.iterate(forum, page + 1, count);
      }
    } catch (error) {
      throw error;
    }
  }
}

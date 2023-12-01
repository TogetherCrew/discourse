import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { Job } from 'bullmq';

type ExtractDto = {
  forum: Forum;
  group: Group;
};

type TransformDto = ExtractDto & {
  owners: GroupMember[];
  group: Group;
};

type LoadDto = {
  batch: any[];
  groupId: number;
};

@Injectable()
export class GroupOwnersService extends EtlService {
  async transform(job: Job<TransformDto, any, string>) {
    try {
      const { forum, owners, group } = job.data;
      const batch = owners.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.GROUP_OWNER,
        data: { batch, groupId: group.id },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>) {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_GROUP_OWNERS, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

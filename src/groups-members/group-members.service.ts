import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { FlowProducer, Job } from 'bullmq';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

type ExtractDto = {
  forum: Forum;
  group: Group;
};

type TransformDto = ExtractDto & {
  members: GroupMember[];
  group: Group;
};

type LoadDto = {
  batch: any[];
  groupId: number;
};

@Injectable()
export class GroupMembersService extends EtlService {
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
      const { forum, group } = job.data;
      return this.iterate(forum, group);
    } catch (error) {
      job.log(error.message);
    }
  }

  async transform(job: Job<TransformDto, any, string>) {
    try {
      const { forum, members, group } = job.data;
      const batch = members.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.GROUP_MEMBER,
        data: { batch, groupId: group.id },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>) {
    try {
      await this.neo4jService.write(
        CYPHERS.BULK_CREATE_GROUP_MEMBERS,
        job.data,
      );
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async iterate(forum: Forum, group: Group, offset = 0, limit = 50) {
    try {
      const { data } = await this.discourseService.getGroupMembers(
        forum.endpoint,
        group.name,
        offset,
        limit,
      );
      const { members, owners, meta }: GroupMembersResponse = data;

      await this.flowProducer.addBulk([
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.GROUP_MEMBER,
          data: { forum, group, members },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.GROUP_OWNER,
          data: { forum, group, owners },
        },
        ...members.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTION,
          data: { forum, user },
        })),
        ...members.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_BADGE,
          data: { forum, user },
        })),
        ...owners.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTION,
          data: { forum, user },
        })),
        ...owners.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_BADGE,
          data: { forum, user },
        })),
      ]);

      offset += limit;
      if (offset >= meta.total) {
        return;
      } else {
        return await this.iterate(forum, group, offset, limit);
      }
    } catch (error) {
      throw error;
    }
  }
}

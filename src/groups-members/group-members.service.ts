import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { FlowProducer, Job, Queue } from 'bullmq';
import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
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
    @InjectQueue(QUEUES.EXTRACT) private readonly extractQueue: Queue,
  ) {
    super(discourseService, baseTransformerService, neo4jService, flowProducer);
  }

  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    const { forum, group } = job.data;
    return this.iterate(forum, group);
  }

  async transform(job: Job<TransformDto, any, string>) {
    const { forum, members, group } = job.data;
    const batch = members.map((obj) =>
      this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
    );
    await this.flowProducer.add({
      queueName: QUEUES.LOAD,
      name: JOBS.GROUP_MEMBER,
      data: { batch, groupId: group.id },
    });
  }

  async load(job: Job<LoadDto, any, string>) {
    await this.neo4jService.write(CYPHERS.BULK_CREATE_GROUP_MEMBERS, job.data);
  }

  private async iterate(forum: Forum, group: Group, offset = 0, limit = 50) {
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
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_ACTION,
        forum,
        members,
      )),
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_BADGE,
        forum,
        members,
      )),
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_ACTION,
        forum,
        owners,
      )),
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_BADGE,
        forum,
        owners,
      )),
    ]);

    offset += limit;
    if (offset >= meta.total) {
      return;
    } else {
      return await this.iterate(forum, group, offset, limit);
    }
  }

  private async uniqueJobs(
    queueName: string,
    name: string,
    forum: Forum,
    users: GroupMember[],
  ) {
    const since = Date.now() - 24 * 60 * 60 * 1000; // 24 Hours

    let jobs = await this.extractQueue.getJobs();
    console.log('jobs.length', jobs.length);
    jobs = jobs.filter((job) => job.name === name && since < job.timestamp);

    const array = [];
    users.forEach((user) => {
      if (jobs.find((job) => job.data.user.username === user.username)) {
        // do nothing, job exists
      } else {
        array.push(user);
      }
    });

    return array.map((user) => ({
      queueName,
      name,
      data: { forum, user },
    }));
  }
}

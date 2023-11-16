import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { FlowProducer, Job, Queue } from 'bullmq';
import { Forum } from '../forums/entities/forum.entity';
import { DiscourseService } from '@app/discourse';
import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Neo4jService } from 'nest-neo4j';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Injectable()
export class UsersService extends EtlService {
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

  async transform(job: Job<any, any, string>): Promise<any> {
    const { forum, users } = job.data;
    const batch = users.map((user) => {
      const obj = this.baseTransformerService.transform(user, {
        forum_uuid: forum.uuid,
      });
      delete obj.associatedAccounts;
      delete obj.groups;
      delete obj.approvedBy;
      delete obj.penaltyCounts;
      delete obj.externalIds;
      return obj;
    });
    await this.flowProducer.addBulk([
      {
        queueName: QUEUES.USER,
        name: JOBS.LOAD,
        data: { batch },
      },
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_ACTIONS,
        forum,
        batch,
      )),
      ...(await this.uniqueJobs(
        QUEUES.EXTRACT,
        JOBS.USER_BADGES,
        forum,
        batch,
      )),
    ]);
  }

  async load(job: Job<any, any, string>): Promise<any> {
    const { batch } = job.data;
    await this.neo4jService.write(CYPHERS.BULK_CREATE_USER, { batch });
  }

  private async uniqueJobs(
    queueName: string,
    name: string,
    forum: Forum,
    users: GroupMember[],
  ) {
    const since = Date.now() - 24 * 60 * 60 * 1000; // 24 Hours

    let jobs = await this.extractQueue.getJobs([
      'completed',
      'waiting',
      'active',
      'delayed',
      'failed',
    ]);
    jobs = jobs.filter((job) => job.name === name && since < job.timestamp);

    const array = [];
    users.forEach((user) => {
      const jobExists = jobs.some(
        (job) => job.data?.user?.username === user.username,
      );
      if (!jobExists) {
        array.push({
          queueName,
          name,
          data: { forum, user },
        });
      }
    });
    return array;
  }
}

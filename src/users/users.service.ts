import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { FlowProducer, Job } from 'bullmq';
import { DiscourseService } from '@app/discourse';
import { InjectFlowProducer } from '@nestjs/bullmq';
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
  ) {
    super(discourseService, baseTransformerService, neo4jService, flowProducer);
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    try {
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
          queueName: QUEUES.LOAD,
          name: JOBS.USER,
          data: { batch },
        },
        ...batch.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTION,
          data: { forum, user },
        })),
        ...batch.map((user) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_BADGE,
          data: { forum, user },
        })),
      ]);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_USER, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

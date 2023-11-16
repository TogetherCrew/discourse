import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { JOBS } from '../constants/jobs.contants';

@Injectable()
export class OrchestrationService {
  constructor(
    @InjectFlowProducer(FLOW_PRODUCER)
    private readonly flowProducer: FlowProducer,
  ) {}

  async run(forum: Forum) {
    this.flowProducer.addBulk([
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.TOPICS,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.CATEGORIES,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.BADGES,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.TAGS,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.GROUPS,
        data: { forum },
      },
    ]);
  }
}

import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowJob, FlowProducer } from 'bullmq';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { JOBS } from '../constants/jobs.contants';
import { DiscourseService } from '@app/discourse';

@Injectable()
export class OrchestrationService {
  constructor(
    @InjectFlowProducer(FLOW_PRODUCER)
    private readonly flowProducer: FlowProducer,
    private discourseService: DiscourseService,
  ) {}

  async run(forum: Forum) {
    try {
      console.log('Running job for', forum);
      const latestTopicId = await this.getLatestTopicId(forum);
      await this.flowProducer.addBulk([
        ...[...Array<number>(latestTopicId)].map(
          (_, idx) =>
            ({
              queueName: QUEUES.EXTRACT,
              name: JOBS.TOPIC,
              data: { forum, topicId: idx + 1 },
              opts: { priority: 10 },
            }) as FlowJob,
        ),
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.CATEGORY,
          data: { forum },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.BADGE,
          data: { forum },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.TAG,
          data: { forum },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.GROUP,
          data: { forum },
        },
      ]);
    } catch (error) {
      console.error(error.message);
    }
  }

  private async getLatestTopicId(forum: Forum): Promise<number> {
    const { data } = await this.discourseService.getLatestTopics(
      forum.endpoint,
      0,
      'created',
    );
    const { topic_list } = data;
    const { topics } = topic_list;
    const topicIds = topics.map((topic) => topic.id);
    return Math.max(...topicIds);
  }
}

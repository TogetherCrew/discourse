import { DiscourseService } from '@app/discourse';
import { QUEUES, JOBS } from '@app/discourse/constants';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

interface BasicData {
  endpoint: string;
}

interface TopicData extends BasicData {
  topicId: number;
}

interface PostData extends BasicData {
  postId: number;
}

@Processor(QUEUES.EXTRACT, { concurrency: 200 })
export class ExtractProcessor extends WorkerHost {
  private readonly logger = new Logger(ExtractProcessor.name);

  constructor(private readonly discourseService: DiscourseService) {
    super();
  }

  async process(job: Job<any, any>): Promise<any> {
    switch (job.name) {
      case JOBS.TOPIC:
        return this.handleTopicJob(job);
      case JOBS.POST:
        return this.handlePostJob(job);
      case JOBS.BADGE:
        return this.handleBadgeJob(job);
      case JOBS.EXTRACT:
      // Do nothing
      default:
        break;
    }
  }
  private async handleBadgeJob(
    job: Job<BasicData, any, typeof JOBS.BADGE>,
  ): Promise<any> {
    const { data } = await this.discourseService.getBadges(job.data.endpoint);
  }

  private async handleTopicJob(
    job: Job<TopicData, any, typeof JOBS.TOPIC>,
  ): Promise<any> {
    const { data } = await this.discourseService.getTopic(
      job.data.endpoint,
      job.data.topicId,
    );
  }

  private async handlePostJob(
    job: Job<PostData, any, typeof JOBS.POST>,
  ): Promise<any> {
    const { data } = await this.discourseService.getPost(
      job.data.endpoint,
      job.data.postId,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any, any, string>) {
    this.logger.log(`Completed ${job.name} [${job.id}]`);
  }
}

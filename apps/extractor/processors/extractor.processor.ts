import { Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { QUEUES, JOBS } from '@app/discourse/constants';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Processor(QUEUES.EXTRACT, { concurrency: 200 })
export class ExtractorProcessor extends WorkerHost {
  private readonly logger = new Logger(ExtractorProcessor.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) {
    super();
  }

  async process(job: Job<any, any>): Promise<any> {
    // this.logger.debug(`Running [${job.id}]`);

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
    job: Job<BaseData, any, typeof JOBS.BADGE>,
  ): Promise<any> {
    const { endpoint } = job.data;
    const {
      data: { badges, badge_groupings, badge_types },
    } = await this.discourseService.getBadges(endpoint);

    for (const badge_grouping of badge_groupings) {
      await this.graphClient.emit('createBadgeGrouping', {
        badge_grouping,
        endpoint,
      });
    }
    for (const badge_type of badge_types) {
      await this.graphClient.emit('createBadgeType', { badge_type, endpoint });
    }
    for (const badge of badges) {
      await this.graphClient.emit('createBadge', { badge, endpoint });
    }
  }

  private async handlePostJob(
    job: Job<PostData, any, typeof JOBS.POST>,
  ): Promise<any> {
    const { endpoint, id } = job.data;
    const { data } = await this.discourseService.getPost(endpoint, id);
    await this.graphClient.emit('createPost', data);
  }

  private async handleTopicJob(
    job: Job<TopicData, any, typeof JOBS.TOPIC>,
  ): Promise<any> {
    const { endpoint, id } = job.data;
    const { data } = await this.discourseService.getTopic(endpoint, id);
    await this.graphClient.emit('createTopic', data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any, any, string>) {
    this.logger.log(`Completed ${job.name} [${job.id}]`);
  }
}

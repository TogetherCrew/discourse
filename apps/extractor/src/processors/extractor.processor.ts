import { QUEUES, JOBS } from '@app/discourse/constants';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BadgeService } from '../badge/badge.service';
import { CategoryService } from '../category/category.service';
import { GroupService } from '../group/group.service';
import { PostService } from '../post/post.service';
import { TopicService } from '../topic/topic.service';
import { TagGroupService } from '../tag-group/tag-group.service';

@Processor(QUEUES.EXTRACT, { concurrency: 200 })
export class ExtractorProcessor extends WorkerHost {
  private readonly logger = new Logger(ExtractorProcessor.name);

  constructor(
    private readonly badgeService: BadgeService,
    private readonly categoryService: CategoryService,
    private readonly groupService: GroupService,
    private readonly topicService: TopicService,
    private readonly postService: PostService,
    private readonly tagGroupService: TagGroupService,
  ) {
    super();
  }

  async process(job: Job<any, any>): Promise<any> {
    this.logger.debug(`Running ${job.name} [${job.id}]`);

    switch (job.name) {
      case JOBS.TOPIC:
        return this.topicService.handleJob(job);
      case JOBS.POST:
        return this.postService.handleJob(job);
      case JOBS.BADGE:
        return this.badgeService.handleJob(job);
      case JOBS.CATEGORY:
        return this.categoryService.handleJob(job);
      case JOBS.GROUP:
        return this.groupService.handleJob(job);
      case JOBS.TAG_GROUP:
        return this.tagGroupService.handleJob(job);
      case JOBS.EXTRACT:
      // Do nothing
      default:
        break;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any, any, string>) {
    this.logger.log(`Completed ${job.name} [${job.id}]`);
  }
}

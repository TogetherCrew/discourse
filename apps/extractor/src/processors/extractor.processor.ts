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
import { TagService } from '../tag/tag.service';
import { Phase1Service } from '../phase1/phase1.service';
import { UserService } from '../user/user.service';
import { Phase2Service } from '../phase2/phase2.service';

@Processor(QUEUES.EXTRACT, {
  concurrency: 100,
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: { age: 24 * 3600 },
})
export class ExtractorProcessor extends WorkerHost {
  private readonly logger = new Logger(ExtractorProcessor.name);

  constructor(
    private readonly badgeService: BadgeService,
    private readonly categoryService: CategoryService,
    private readonly groupService: GroupService,
    private readonly topicService: TopicService,
    private readonly postService: PostService,
    private readonly tagGroupService: TagGroupService,
    private readonly tagService: TagService,
    private readonly phase1Service: Phase1Service,
    private readonly phase2Service: Phase2Service,
    private readonly userService: UserService,
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
      case JOBS.TAG:
        return this.tagService.handleJob(job);
      case JOBS.USER:
        return this.userService.handleJob(job);
      case JOBS.PHASE_1:
        return this.phase1Service.handleJob(job);
      case JOBS.PHASE_2:
        return this.phase2Service.handleJob(job);
      default:
        break;
    }
  }
}

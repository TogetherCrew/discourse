import { Job, Queue } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { DiscourseService } from '@app/discourse';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BADGE_GROUPING_QUEUE,
  BADGE_QUEUE,
  BADGE_TYPE_QUEUE,
} from '../../constants/queues.constants';
import { TRANSFORM_JOB } from '../../constants/jobs.contants';
import { Logger } from '@nestjs/common';

export class BadgeExtractHandler extends Handler {
  private readonly logger = new Logger(BadgeExtractHandler.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @InjectQueue(BADGE_QUEUE) private readonly badgeQueue: Queue,
    @InjectQueue(BADGE_TYPE_QUEUE) private readonly badgeTypeQueue: Queue,
    @InjectQueue(BADGE_GROUPING_QUEUE)
    private readonly badgeGroupingQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log('BadgeExtractHandler', job.id);
    const { forum } = job.data;
    const { data } = await this.discourseService.getBadges(forum.endpoint);
    const { badges, badge_types, badge_groupings } = data;
    await this.badgeQueue.add(TRANSFORM_JOB, { forum, badges });
    await this.badgeTypeQueue.add(TRANSFORM_JOB, { forum, badge_types });
    await this.badgeGroupingQueue.add(TRANSFORM_JOB, {
      forum,
      badge_groupings,
    });
  }
}

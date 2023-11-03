import { Job, Queue } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { DiscourseService } from '@app/discourse';
import { InjectQueue } from '@nestjs/bullmq';
import { BADGE_QUEUE } from '../../constants/queues.constants';
import { TRANSFORM_JOB } from '../../constants/jobs.contants';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BadgesExtractHandler extends Handler {
  private readonly logger = new Logger(BadgesExtractHandler.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @InjectQueue(BADGE_QUEUE) private readonly badgeQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log('BadgesExtractHandler', job.id);
    const { forum } = job.data;
    const { data } = await this.discourseService.getBadges(forum.endpoint);
    await this.badgeQueue.add(TRANSFORM_JOB, { forum, ...data });
  }
}

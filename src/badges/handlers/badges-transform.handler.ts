import { Job, Queue } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { TransformBadgesDto } from '../dto/transform-badges.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { BADGE_QUEUE } from '../../constants/queues.constants';
import { LOAD_JOB } from '../../constants/jobs.contants';
import { TransformersService } from '../../transformers/transformers.service';

@Injectable()
export class BadgesTransformHandler extends Handler {
  private readonly logger = new Logger(BadgesTransformHandler.name);

  constructor(
    private readonly transformersService: TransformersService,
    @InjectQueue(BADGE_QUEUE) private readonly queue: Queue,
  ) {
    super();
  }

  async process(job: Job<TransformBadgesDto, any, string>): Promise<any> {
    this.logger.log('BadgesTransformHandler', job.id);
    console.log(this.transformersService);
    const { forum, badges, badge_types, badge_groupings } = job.data;
    const tBadges: any[] = badges.map((badge) =>
      this.transformersService.transform(badge, { forumUUID: forum.uuid }),
    );
    const tBadgeTypes: any[] = badge_types.map((badge_type) =>
      this.transformersService.transform(badge_type, { forumUUID: forum.uuid }),
    );
    const tBadgeGroupings: any[] = badge_groupings.map((badge_grouping) =>
      this.transformersService.transform(badge_grouping, {
        forumUUID: forum.uuid,
      }),
    );
    this.queue.add(LOAD_JOB, {
      badges: tBadges,
      badgeTypes: tBadgeTypes,
      badgeGroupings: tBadgeGroupings,
    });
  }
}

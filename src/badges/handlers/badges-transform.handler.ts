import { Job, Queue } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { Logger } from '@nestjs/common';
import { TransformBadgesDto } from '../dto/transform-badges.dto';
import { LoadBadgeDto } from '../dto/load-badges.dto';
import { BadgesTransformer } from '../badges.transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { LOAD_JOB } from 'src/constants/jobs.contants';

export class BadgesTransformHandler extends Handler {
  private readonly logger = new Logger(BadgesTransformHandler.name);

  constructor(
    private readonly transformer: BadgesTransformer,
    @InjectQueue(BADGE_QUEUE) private readonly queue: Queue,
  ) {
    super();
  }

  async process(job: Job<TransformBadgesDto, any, string>): Promise<any> {
    this.logger.log('BadgesTransformHandler', job.id);
    const { forum, badges } = job.data;
    const output: LoadBadgeDto[] = badges.map((badge: Badge) =>
      this.transformer.transform(badge, forum),
    );
    this.queue.add(LOAD_JOB, { badges: output });
  }
}

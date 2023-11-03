import { Job, Queue } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { TransformBadgesDto } from '../dto/transform-badges.dto';
import { LoadBadgeDto } from '../dto/load-badges.dto';
import { BadgesTransformer } from '../badges.transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { BADGE_QUEUE } from '../../constants/queues.constants';
import { LOAD_JOB } from '../../constants/jobs.contants';

@Injectable()
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
    console.log('badges', badges);
    const output: LoadBadgeDto[] = badges.map((badge) =>
      this.transformer.transform(badge, forum),
    );
    console.log('output', output);
    this.queue.add(LOAD_JOB, { badges: output });
  }
}

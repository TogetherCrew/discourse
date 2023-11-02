import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { Logger } from '@nestjs/common';
import { TransformBadgesDto } from '../dto/transform-badges.dto';

export class BadgesTransformHandler extends Handler {
  private readonly logger = new Logger(BadgesTransformHandler.name);

  async process(job: Job<TransformBadgesDto, any, string>): Promise<any> {
    this.logger.log('BadgesTransformHandler', job.id);
  }
}

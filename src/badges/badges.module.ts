import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  BADGE_GROUPING_QUEUE,
  BADGE_QUEUE,
  BADGE_TYPE_QUEUE,
} from 'src/constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BadgesService } from './badges.service';
import { BadgesTransformer } from './badges.transformer';
import { BadgesExtractHandler } from './handlers/badges-extract.handler';
import { BadgesTransformHandler } from './handlers/badges-transform.handler';
import { BadgesLoadHandler } from './handlers/badges-load.handler';
import { BadgesRepository } from './badges.repository';
import { DiscourseModule } from '@app/discourse';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: BADGE_QUEUE },
      { name: BADGE_TYPE_QUEUE },
      { name: BADGE_GROUPING_QUEUE },
    ),
    DiscourseModule,
  ],
  providers: [
    BadgesProcessor,
    BadgesService,
    BadgesTransformer,
    BadgesExtractHandler,
    BadgesTransformHandler,
    BadgesLoadHandler,
    BadgesRepository,
  ],
})
export class BadgesModule {}

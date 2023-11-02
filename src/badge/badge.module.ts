import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { BadgeProcessor } from './badge.processor';
import { BadgeService } from './badge.service';

@Module({
  imports: [BullModule.registerQueue({ name: BADGE_QUEUE })],
  providers: [BadgeProcessor, BadgeService],
})
export class BadgeModule {}

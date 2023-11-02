import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BADGE_QUEUE } from 'src/constants/queues';

@Module({
  imports: [BullModule.registerQueue({ name: BADGE_QUEUE })],
})
export class BadgeModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BadgesService } from './badges.service';
import { BadgesTransformer } from './badges.transformer';

@Module({
  imports: [BullModule.registerQueue({ name: BADGE_QUEUE })],
  providers: [BadgesProcessor, BadgesService, BadgesTransformer],
})
export class BadgesModule {}

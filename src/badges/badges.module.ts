import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BadgesService } from './badges.service';
import { BadgeGroupingsModule } from 'src/badge-groupings/badge-groupings.module';
import { BadgeTypesModule } from 'src/badge-types/badge-types.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: BADGE_QUEUE }),
    BadgeTypesModule,
    BadgeGroupingsModule,
  ],
  providers: [BadgesProcessor, BadgesService],
})
export class BadgesModule {}

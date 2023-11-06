import { Module } from '@nestjs/common';
import { BadgeGroupingsProcessor } from './badge-groupings.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from 'src/base-etl/base-etl.module';
import { QUEUES } from 'src/constants/queues.constants';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.BADGE_GROUPING }),
    BaseEtlModule,
  ],
  providers: [BadgeGroupingsProcessor],
})
export class BadgeGroupingsModule {}

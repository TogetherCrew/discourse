import { Module } from '@nestjs/common';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { UserBadgesService } from './user-badges.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [UserBadgesService],
  exports: [UserBadgesService],
})
export class UserBadgesModule {}

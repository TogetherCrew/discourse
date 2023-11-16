import { Module } from '@nestjs/common';
import { UserBadgesProcessor } from './user-badges.processor';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { QUEUES } from '../constants/queues.constants';
import { UserBadgesService } from './user-badges.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.USER_BADGES }),
    BullBoardModule.forFeature({
      name: QUEUES.USER_BADGES,
      adapter: BullMQAdapter,
    }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [UserBadgesProcessor, UserBadgesService],
  exports: [UserBadgesService],
})
export class UserBadgesModule {}

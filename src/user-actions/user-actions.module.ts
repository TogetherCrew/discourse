import { Module } from '@nestjs/common';
import { UserActionsProcessor } from './user-actions.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { UserActionsService } from './user-actions.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Neo4jModule } from 'nest-neo4j';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.USER_ACTIONS }),
    BullBoardModule.forFeature({
      name: QUEUES.USER_ACTIONS,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [UserActionsProcessor, UserActionsService],
  exports: [UserActionsService],
})
export class UserActionsModule {}

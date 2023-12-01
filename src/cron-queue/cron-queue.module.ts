import { Module } from '@nestjs/common';
import { CronQueueProcessor } from './cron-queue.processor';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { Neo4jModule } from 'nest-neo4j/dist';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { OrchestrationModule } from '../orchestration/orchestration.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.CRON,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.CRON,
      adapter: BullMQAdapter,
    }),
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    Neo4jModule,
    OrchestrationModule,
  ],
  providers: [CronQueueProcessor],
})
export class CronQueueModule {}

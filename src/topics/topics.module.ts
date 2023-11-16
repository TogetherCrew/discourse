import { Module } from '@nestjs/common';
import { TopicsProcessor } from './topics.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';
import { TopicsService } from './topics.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOW_PRODUCER,
    }),
    BullModule.registerQueue({ name: QUEUES.TOPIC }),
    BullBoardModule.forFeature({
      name: QUEUES.TOPIC,
      adapter: BullMQAdapter,
    }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [TopicsProcessor, TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}

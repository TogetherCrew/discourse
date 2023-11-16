import { Module } from '@nestjs/common';
import { TopicTagsProcessor } from './topic-tags.processor';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { QUEUES } from '../constants/queues.constants';
import { TopicTagsService } from './topic-tags.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.TOPIC_TAGS }),
    BullBoardModule.forFeature({
      name: QUEUES.TOPIC_TAGS,
      adapter: BullMQAdapter,
    }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [TopicTagsProcessor, TopicTagsService],
  exports: [TopicTagsService],
})
export class TopicTagsModule {}

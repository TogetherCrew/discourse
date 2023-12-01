import { Module } from '@nestjs/common';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { TopicTagsService } from './topic-tags.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [TopicTagsService],
  exports: [TopicTagsService],
})
export class TopicTagsModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TopicsService } from './topics.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOW_PRODUCER,
    }),
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}

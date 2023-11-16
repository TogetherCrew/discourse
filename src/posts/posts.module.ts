import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PostsService } from './posts.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

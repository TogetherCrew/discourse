import { Module } from '@nestjs/common';
import { ExtractorProcessor } from './extractor.processor';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUES } from '@app/discourse/constants';
import { BadgeModule } from '../badge/badge.module';
import { CategoryModule } from '../category/category.module';
import { GroupModule } from '../group/group.module';
import { PostModule } from '../post/post.module';
import { TopicModule } from '../topic/topic.module';
import { TagGroupModule } from '../tag-group/tag-group.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.EXTRACT,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.EXTRACT,
      adapter: BullMQAdapter,
    }),
    BadgeModule,
    CategoryModule,
    GroupModule,
    PostModule,
    TopicModule,
    TagGroupModule,
  ],
  providers: [ExtractorProcessor],
})
export class ProcessorsModule { }

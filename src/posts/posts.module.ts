import { Module } from '@nestjs/common';
import { PostsProcessor } from './posts.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';
import { PostsEtlService } from './posts-etl.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from 'src/base-transformer/base-transformer.module';
import { FLOWS } from 'src/constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOWS.POST_TL,
    }),
    BullModule.registerQueue({ name: QUEUES.POST }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [PostsProcessor, PostsEtlService],
})
export class PostsModule {}

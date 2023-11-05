import { Module } from '@nestjs/common';
import { TopicsProcessor } from './topics.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';
import { TopicsEtlService } from './topics-etl.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from 'src/base-transformer/base-transformer.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.TOPIC }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [TopicsProcessor, TopicsEtlService],
})
export class TopicsModule {}

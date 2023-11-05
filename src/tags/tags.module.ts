import { Module } from '@nestjs/common';
import { TagsProcessor } from './tags.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.TAG }), BaseEtlModule],
  providers: [TagsProcessor],
})
export class TagsModule {}

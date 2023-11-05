import { Module } from '@nestjs/common';
import { TagsProcessor } from './tags.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlSchemaModule } from 'src/base-etl/base-etl.module';
import { QUEUES } from 'src/constants/queues.constants';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.TAG_GROUP }),
    BaseEtlSchemaModule,
  ],
  providers: [TagsProcessor],
})
export class TagGroupsModule {}

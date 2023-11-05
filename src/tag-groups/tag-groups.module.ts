import { Module } from '@nestjs/common';
import { TagGroupsProcessor } from './tag-groups.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlSchemaModule } from 'src/base-etl/base-etl.module';
import { QUEUES } from 'src/constants/queues.constants';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.TAG_GROUP }),
    BaseEtlSchemaModule,
  ],
  providers: [TagGroupsProcessor],
})
export class TagGroupsModule {}

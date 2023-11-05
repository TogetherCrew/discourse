import { Module } from '@nestjs/common';
import { GroupsProcessor } from './groups.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlSchemaModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';
import { GroupsEtlService } from './groups-etl.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.GROUP }),
    BaseEtlSchemaModule,
  ],
  providers: [GroupsProcessor, GroupsEtlService],
})
export class GroupsModule {}

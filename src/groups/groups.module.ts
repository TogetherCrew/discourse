import { Module } from '@nestjs/common';
import { GroupsProcessor } from './groups.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { QUEUES } from '../constants/queues.constants';
import { GroupsEtlService } from './groups-etl.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from 'src/base-transformer/base-transformer.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.GROUP }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [GroupsProcessor, GroupsEtlService],
})
export class GroupsModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from 'src/constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BaseEtlSchemaModule } from 'src/base-etl/base-etl.module';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.BADGE }), BaseEtlSchemaModule],
  providers: [BadgesProcessor],
})
export class BadgesModule {}

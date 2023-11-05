import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from 'src/constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BaseEtlModule } from 'src/base-etl/base-etl.module';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.BADGE }), BaseEtlModule],
  providers: [BadgesProcessor],
})
export class BadgesModule {}

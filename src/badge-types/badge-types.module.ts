import { Module } from '@nestjs/common';
import { BadgeTypesProcessor } from './badge-types.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from 'src/constants/queues.constants';
import { BaseEtlSchemaModule } from 'src/base-etl/base-etl.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.BADGE_TYPE }),
    BaseEtlSchemaModule,
  ],
  providers: [BadgeTypesProcessor],
})
export class BadgeTypesModule {}

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOWS } from 'src/constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { EtlSchemaModule } from 'src/etl-schema/etl-schema.module';
import { BadgeTypesModule } from 'src/badge-types/badge-types.module';
import { BadgeGroupingsModule } from 'src/badge-groupings/badge-groupings.module';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOWS.DISCOURSE_ETL,
    }),
    EtlSchemaModule,
    BadgeTypesModule,
    BadgeGroupingsModule,
    BadgesModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

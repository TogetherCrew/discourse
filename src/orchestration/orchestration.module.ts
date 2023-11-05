import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOWS } from '../constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { EtlSchemaModule } from '../etl-schema/etl-schema.module';
import { BadgeTypesModule } from '../badge-types/badge-types.module';
import { BadgeGroupingsModule } from '../badge-groupings/badge-groupings.module';
import { BadgesModule } from '../badges/badges.module';
import { TagGroupsModule } from '../tag-groups/tag-groups.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOWS.DISCOURSE_ETL,
    }),
    EtlSchemaModule,
    BadgeTypesModule,
    BadgeGroupingsModule,
    BadgesModule,
    TagGroupsModule,
    TagsModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

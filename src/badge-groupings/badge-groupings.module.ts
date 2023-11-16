import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { BadgeGroupingsService } from './badge-groupings.service';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [BadgeGroupingsService],
  exports: [BadgeGroupingsService],
})
export class BadgeGroupingsModule {}

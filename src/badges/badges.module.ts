import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BadgesService } from './badges.service';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}

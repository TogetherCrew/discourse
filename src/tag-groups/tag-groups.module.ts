import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TagGroupsService } from './tag-groups.service';
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
  providers: [TagGroupsService],
  exports: [TagGroupsService],
})
export class TagGroupsModule {}

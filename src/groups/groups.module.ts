import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { GroupsService } from './groups.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Neo4jModule } from 'nest-neo4j';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}

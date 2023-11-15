import { Module } from '@nestjs/common';
import { GroupsProcessor } from './groups.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { GroupsService } from './groups.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Neo4jModule } from 'nest-neo4j';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.GROUP }),
    BullBoardModule.forFeature({
      name: QUEUES.GROUP,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [GroupsProcessor, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}

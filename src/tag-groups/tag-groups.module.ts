import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { TagGroupsProcessor } from './tag-groups.processor';
import { TagGroupsService } from './tag-groups.service';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.TAG_GROUP }),
    BullBoardModule.forFeature({
      name: QUEUES.TAG_GROUP,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [TagGroupsProcessor, TagGroupsService],
})
export class TagGroupsModule {}

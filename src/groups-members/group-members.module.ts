import { Module } from '@nestjs/common';
import { GroupMembersProcessor } from './group-members.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { GroupMembersService } from './group-members.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Neo4jModule } from 'nest-neo4j';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.GROUP_MEMBERS }),
    BullModule.registerQueue({ name: QUEUES.EXTRACT }),
    BullBoardModule.forFeature({
      name: QUEUES.GROUP_MEMBERS,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [GroupMembersProcessor, GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}

import { Module } from '@nestjs/common';
import { GroupOwnersProcessor } from './group-owners.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { GroupOwnersService } from './group-owners.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Neo4jModule } from 'nest-neo4j';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.GROUP_OWNERS }),
    BullBoardModule.forFeature({
      name: QUEUES.GROUP_OWNERS,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [GroupOwnersProcessor, GroupOwnersService],
})
export class GroupOwnersModule {}

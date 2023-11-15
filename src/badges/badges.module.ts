import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { BadgesProcessor } from './badges.processor';
import { BadgesService } from './badges.service';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.BADGE }),
    BullBoardModule.forFeature({
      name: QUEUES.BADGE,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [BadgesProcessor, BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}

import { Module } from '@nestjs/common';
import { BadgeGroupingsProcessor } from './badge-groupings.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { BadgeGroupingsService } from './badge-groupings.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.BADGE_GROUPING }),
    BullBoardModule.forFeature({
      name: QUEUES.BADGE_GROUPING,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [BadgeGroupingsProcessor, BadgeGroupingsService],
})
export class BadgeGroupingsModule {}

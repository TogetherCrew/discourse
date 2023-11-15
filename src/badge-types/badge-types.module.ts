import { Module } from '@nestjs/common';
import { BadgeTypesProcessor } from './badge-types.processor';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { DiscourseModule } from '@app/discourse';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { BadgeTypesService } from './badge-types.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.BADGE_TYPE }),
    BullBoardModule.forFeature({
      name: QUEUES.BADGE_TYPE,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
    BaseTransformerModule,
    Neo4jModule,
  ],
  providers: [BadgeTypesProcessor, BadgeTypesService],
})
export class BadgeTypesModule {}

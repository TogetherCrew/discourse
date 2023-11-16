import { Module } from '@nestjs/common';
import { UsersProcessor } from './users.processor';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { QUEUES } from '../constants/queues.constants';
import { UsersService } from './users.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    BullModule.registerQueue({ name: QUEUES.EXTRACT }),
    BullModule.registerQueue({ name: QUEUES.USER }),
    BullBoardModule.forFeature({
      name: QUEUES.USER,
      adapter: BullMQAdapter,
    }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [UsersProcessor, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

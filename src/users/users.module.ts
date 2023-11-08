import { Module } from '@nestjs/common';
import { UsersProcessor } from './users.processor';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from '../base-etl/base-etl.module';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { QUEUES } from '../constants/queues.constants';
import { UsersEtlService } from './users-etl.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.USER }),
    BullBoardModule.forFeature({
      name: QUEUES.USER,
      adapter: BullMQAdapter,
    }),
    BaseEtlModule,
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [UsersProcessor, UsersEtlService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ExtractProcessor } from './extract.processor';
import { BullModule } from '@nestjs/bullmq';
import { DiscourseModule } from '@app/discourse';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUES } from '@app/discourse/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.EXTRACT,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.EXTRACT,
      adapter: BullMQAdapter,
    }),
    DiscourseModule,
  ],
  providers: [ExtractProcessor],
})
export class ProcessorsModule { }

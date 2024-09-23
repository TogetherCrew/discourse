import { Module } from '@nestjs/common';
import { ExtractorProcessor } from './extractor.processor';
import { BullModule } from '@nestjs/bullmq';
import { DiscourseModule } from '@app/discourse';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUES } from '@app/discourse/constants';
import { RmqModule, Services } from '@app/common';

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
    RmqModule.register(Services.graph),
  ],
  providers: [ExtractorProcessor],
})
export class ProcessorsModule { }

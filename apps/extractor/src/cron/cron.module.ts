import { Module } from '@nestjs/common';
import { CronProcessor } from './cron.processor';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '@app/discourse/constants';
import { RmqModule, Services } from '@app/common';
import { CronService } from './cron.service';
import { ExtractorModule } from '../extractor/extractor.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.CRON,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.CRON,
      adapter: BullMQAdapter,
    }),
    RmqModule.register(Services.mongo),
    RmqModule.register(Services.graph),
    ExtractorModule,
  ],
  providers: [CronService, CronProcessor],
  exports: [CronService],
})
export class CronModule { }

import { Module } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { RmqModule, Services } from '@app/common';
import { ProcessorsModule } from '../processors/processors.modules';
import { DiscourseModule } from '@app/discourse';
import { CommonModule } from '../common/common.module';
import { FLOW_PRODUCER } from '@app/discourse/constants';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    RmqModule.register(Services.mongo),
    BullModule.registerFlowProducer({
      name: FLOW_PRODUCER,
    }),
    ProcessorsModule,
    DiscourseModule,
    CommonModule,
  ],
  providers: [ExtractorService],
  exports: [ExtractorService],
})
export class ExtractorModule { }

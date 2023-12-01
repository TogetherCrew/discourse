import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { ExtractModule } from '../extract/extract.module';
import { DiscourseModule } from '@app/discourse';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    ExtractModule,
    DiscourseModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

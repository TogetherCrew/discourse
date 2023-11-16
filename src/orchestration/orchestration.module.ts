import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { ExtractModule } from '../extract/extract.module';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    ExtractModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

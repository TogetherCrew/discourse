import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOWS } from 'src/constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { EtlModule } from 'src/etl/etl.module';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: FLOWS.DISCOURSE_ETL,
    }),
    EtlModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

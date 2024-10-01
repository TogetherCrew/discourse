import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { Phase1Service } from './phase1.service';
import { FLOW_PRODUCER } from '@app/discourse/constants';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    CommonModule,
    BullModule.registerFlowProducer({
      name: FLOW_PRODUCER,
    }),
  ],
  providers: [Phase1Service],
  exports: [Phase1Service],
})
export class Phase1Module { }

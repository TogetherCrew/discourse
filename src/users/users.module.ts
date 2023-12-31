import { Module } from '@nestjs/common';
import { DiscourseModule } from '@app/discourse';
import { BullModule } from '@nestjs/bullmq';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { UsersService } from './users.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    DiscourseModule,
    BaseTransformerModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

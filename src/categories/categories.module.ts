import { Module } from '@nestjs/common';
import { CategoriesProcessor } from './categories.processor';
import { BullModule } from '@nestjs/bullmq';
import { BaseEtlModule } from 'src/base-etl/base-etl.module';
import { QUEUES } from 'src/constants/queues.constants';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.CATEGORY }), BaseEtlModule],
  providers: [CategoriesProcessor],
})
export class CategoriesModule {}

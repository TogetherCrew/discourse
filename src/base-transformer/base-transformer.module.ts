import { Module } from '@nestjs/common';
import { BaseTransformerService } from './base-transformer.service';

@Module({
  providers: [BaseTransformerService],
  exports: [BaseTransformerService],
})
export class BaseTransformerModule {}

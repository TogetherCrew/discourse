import { Module } from '@nestjs/common';
import { TransformersService } from './transformers.service';

@Module({
  providers: [TransformersService],
})
export class TransformersModule {}

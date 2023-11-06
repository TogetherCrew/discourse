import { Module } from '@nestjs/common';
import { BottleneckService } from './bottleneck.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BottleneckService],
  exports: [BottleneckService],
})
export class BottleneckModule {}

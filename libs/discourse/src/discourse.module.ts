import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { BottleneckModule } from './bottleneck/bottleneck.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
  imports: [BottleneckModule, ConfigModule],
})
export class DiscourseModule {}

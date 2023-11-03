import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { BottleneckModule } from './bottleneck/bottleneck.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
  imports: [BottleneckModule, HttpModule],
})
export class DiscourseModule {}

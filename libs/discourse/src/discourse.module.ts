import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { BottleneckModule } from './bottleneck/bottleneck.module';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
  imports: [BottleneckModule],
})
export class DiscourseModule {}

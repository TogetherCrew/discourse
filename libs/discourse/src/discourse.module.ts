import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
})
export class DiscourseModule {}

import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { BottleneckModule } from './bottleneck/bottleneck.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
  imports: [BottleneckModule, HttpModule, ConfigModule],
})
export class DiscourseModule {}

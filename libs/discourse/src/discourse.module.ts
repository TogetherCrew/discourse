import { Module } from '@nestjs/common';
import { DiscourseService } from './discourse.service';
import { BottleneckModule } from './bottleneck/bottleneck.module';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import { HistoryModule } from './history/history.module';

@Module({
  providers: [DiscourseService],
  exports: [DiscourseService],
  imports: [BottleneckModule, ConfigModule, ProxyModule, HistoryModule],
})
export class DiscourseModule {}

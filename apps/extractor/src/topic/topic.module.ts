import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule { }

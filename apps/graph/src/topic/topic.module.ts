import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [CommonModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule { }

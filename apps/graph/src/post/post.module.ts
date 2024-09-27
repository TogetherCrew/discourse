import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [CommonModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }

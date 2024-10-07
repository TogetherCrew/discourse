import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule { }

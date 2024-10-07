import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule { }

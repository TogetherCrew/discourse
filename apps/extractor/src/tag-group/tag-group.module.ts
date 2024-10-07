import { Module } from '@nestjs/common';
import { TagGroupService } from './tag-group.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TagGroupService],
  exports: [TagGroupService],
})
export class TagGroupModule { }

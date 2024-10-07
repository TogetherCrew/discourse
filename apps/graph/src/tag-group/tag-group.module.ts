import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TagGroupController } from './tag-group.controller';
import { TagGroupService } from './tag-group.service';

@Module({
  imports: [CommonModule],
  controllers: [TagGroupController],
  providers: [TagGroupService],
})
export class TagGroupModule { }

import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule { }

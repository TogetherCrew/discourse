import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [CommonModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule { }

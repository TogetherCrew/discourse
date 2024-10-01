import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserActionController } from './user-action.controller';
import { UserActionService } from './user-action.service';

@Module({
  imports: [CommonModule],
  controllers: [UserActionController],
  providers: [UserActionService],
})
export class UserActionModule { }

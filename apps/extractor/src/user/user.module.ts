import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }

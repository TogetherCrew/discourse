import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule { }

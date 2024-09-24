import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';

@Module({
  imports: [CommonModule],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule { }

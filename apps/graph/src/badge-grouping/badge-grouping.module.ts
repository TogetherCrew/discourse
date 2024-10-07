import { Module } from '@nestjs/common';
import { BadgeGroupingController } from './badge-grouping.controller';
import { BadgeGroupingService } from './badge-grouping.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [BadgeGroupingController],
  providers: [BadgeGroupingService],
})
export class BadgeGroupingModule { }

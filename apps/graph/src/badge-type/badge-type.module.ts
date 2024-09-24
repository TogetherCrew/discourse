import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { BadgeTypeController } from './badge-type.controller';
import { BadgeTypeService } from './badge-type.service';

@Module({
  imports: [CommonModule],
  controllers: [BadgeTypeController],
  providers: [BadgeTypeService],
})
export class BadgeTypeModule { }

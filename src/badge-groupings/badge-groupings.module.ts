import { Module } from '@nestjs/common';
import { BadgeGroupingsService } from './badge-groupings.service';
import { BadgeGroupingsRepository } from './badge-groupings.repository';

@Module({
  providers: [BadgeGroupingsService, BadgeGroupingsRepository],
})
export class BadgeGroupingsModule {}

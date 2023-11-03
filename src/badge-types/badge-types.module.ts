import { Module } from '@nestjs/common';
import { BadgeTypesService } from './badge-types.service';
import { BadgeTypesRepository } from './badge-types.repository';

@Module({
  providers: [BadgeTypesService, BadgeTypesRepository],
})
export class BadgeTypesModule {}

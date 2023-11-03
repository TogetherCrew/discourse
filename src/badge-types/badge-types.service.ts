import { Injectable } from '@nestjs/common';
import { LoadBadgeTypeDto } from '../badges/dto/load-badges.dto';
import { BadgeTypesRepository } from './badge-types.repository';

@Injectable()
export class BadgeTypesService {
  constructor(private readonly repository: BadgeTypesRepository) {}

  async insertMany(badgeTypes: LoadBadgeTypeDto[]) {
    return this.repository.insertMany(badgeTypes);
  }
}

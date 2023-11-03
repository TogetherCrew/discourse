import { Injectable } from '@nestjs/common';
import { LoadBadgeTypeDto } from './dto/load-badge-type.dto';
import { BadgeTypesRepository } from './badge-types.repository';

@Injectable()
export class BadgeTypesService {
  constructor(private readonly repository: BadgeTypesRepository) {}

  async insertMany(badgeTypes: LoadBadgeTypeDto[]) {
    return this.repository.insertMany(badgeTypes);
  }
}

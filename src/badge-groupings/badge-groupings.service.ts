import { Injectable } from '@nestjs/common';
import { LoadBadgeGroupingDto } from '../badges/dto/load-badges.dto';
import { BadgeGroupingsRepository } from './badge-groupings.repository';

@Injectable()
export class BadgeGroupingsService {
  constructor(private readonly repository: BadgeGroupingsRepository) {}

  async insertMany(badgeGroupings: LoadBadgeGroupingDto[]) {
    return this.repository.insertMany(badgeGroupings);
  }
}

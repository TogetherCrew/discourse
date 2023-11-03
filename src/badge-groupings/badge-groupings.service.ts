import { Injectable } from '@nestjs/common';
import { LoadBadgeGroupingDto } from './dto/load-badge-grouping.dto';
import { BadgeGroupingsRepository } from './badge-groupings.repository';

@Injectable()
export class BadgeGroupingsService {
  constructor(private readonly repository: BadgeGroupingsRepository) {}

  async insertMany(badgeGroupings: LoadBadgeGroupingDto[]) {
    return this.repository.insertMany(badgeGroupings);
  }
}

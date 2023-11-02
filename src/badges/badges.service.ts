import { Injectable } from '@nestjs/common';
import { LoadBadgeDto } from './dto/load-badges.dto';
import { BadgesRepository } from './badges.repository';

@Injectable()
export class BadgesService {
  constructor(private readonly repository: BadgesRepository) {}

  async insertMany(badges: LoadBadgeDto[]) {
    return this.repository.insertMany(badges);
  }
}

import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { LoadBadgesDto } from '../dto/load-badges.dto';
import { BadgesService } from '../badges.service';
import { Injectable } from '@nestjs/common';
import { BadgeTypesService } from '../../badge-types/badge-types.service';
import { BadgeGroupingsService } from '../../badge-groupings/badge-groupings.service';

@Injectable()
export class BadgesLoadHandler extends Handler {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly badgeTypesService: BadgeTypesService,
    private readonly badgeGroupingsService: BadgeGroupingsService,
  ) {
    super();
  }

  async process(job: Job<LoadBadgesDto, any, string>): Promise<any> {
    console.log('BadgesLoadHandler', job.id);
    const { badges, badgeTypes, badgeGroupings } = job.data;
    await this.badgeTypesService.insertMany(badgeTypes);
    await this.badgeGroupingsService.insertMany(badgeGroupings);
    await this.badgesService.insertMany(badges);
  }
}

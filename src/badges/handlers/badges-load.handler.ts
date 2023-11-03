import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';
import { LoadBadgesDto } from '../dto/load-badges.dto';
import { BadgesService } from '../badges.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BadgesLoadHandler extends Handler {
  constructor(public readonly badgeService: BadgesService) {
    super();
  }

  async process(job: Job<LoadBadgesDto, any, string>): Promise<any> {
    console.log('BadgesLoadHandler', job.id);
    const { badges } = job.data;
    await this.badgeService.insertMany(badges);
  }
}

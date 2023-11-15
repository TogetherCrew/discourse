import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { BadgeGroupingsService } from './badge-groupings.service';

@Processor(QUEUES.BADGE_GROUPING)
export class BadgeGroupingsProcessor extends BaseEtlProcessor {
  constructor(private readonly badgeGroupingsService: BadgeGroupingsService) {
    super(badgeGroupingsService);
  }
}

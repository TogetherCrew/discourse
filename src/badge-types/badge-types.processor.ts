import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { BadgeTypesService } from './badge-types.service';

@Processor(QUEUES.BADGE_TYPE)
export class BadgeTypesProcessor extends BaseEtlProcessor {
  constructor(private readonly badgeTypesService: BadgeTypesService) {
    super(badgeTypesService);
  }
}

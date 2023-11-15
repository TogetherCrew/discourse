import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { BadgesService } from './badges.service';

@Processor(QUEUES.BADGE)
export class BadgesProcessor extends BaseEtlProcessor {
  constructor(private readonly badgesService: BadgesService) {
    super(badgesService);
  }
}

import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { UserBadgesService } from './user-badges.service';

@Processor(QUEUES.USER_BADGES, { concurrency: 20 })
export class UserBadgesProcessor extends BaseEtlProcessor {
  constructor(private readonly userBadgesService: UserBadgesService) {
    super(userBadgesService);
  }
}

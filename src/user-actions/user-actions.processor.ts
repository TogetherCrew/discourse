import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { UserActionsService } from './user-actions.service';

@Processor(QUEUES.USER_ACTIONS, { concurrency: 2 })
export class UserActionsProcessor extends BaseEtlProcessor {
  constructor(private readonly userActionsService: UserActionsService) {
    super(userActionsService);
  }
}

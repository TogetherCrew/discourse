import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { UsersEtlService } from './users-etl.service';

@Processor(QUEUES.USER, { concurrency: 5 })
export class UsersProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: UsersEtlService) {
    super(myservice);
  }
}

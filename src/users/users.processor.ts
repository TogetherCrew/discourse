import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { UsersService } from './users.service';

@Processor(QUEUES.USER, { concurrency: 2 })
export class UsersProcessor extends BaseEtlProcessor {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
}

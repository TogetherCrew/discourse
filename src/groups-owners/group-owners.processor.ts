import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { GroupOwnersService } from './group-owners.service';

@Processor(QUEUES.GROUP_OWNERS)
export class GroupOwnersProcessor extends BaseEtlProcessor {
  constructor(private readonly groupOwnersService: GroupOwnersService) {
    super(groupOwnersService);
  }
}

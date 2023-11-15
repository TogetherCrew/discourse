import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { GroupMembersService } from './group-members.service';

@Processor(QUEUES.GROUP_MEMBERS, { concurrency: 2 })
export class GroupMembersProcessor extends BaseEtlProcessor {
  constructor(private readonly groupMembersService: GroupMembersService) {
    super(groupMembersService);
  }
}

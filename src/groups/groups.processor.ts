import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { GroupsService } from './groups.service';

@Processor(QUEUES.GROUP)
export class GroupsProcessor extends BaseEtlProcessor {
  constructor(private readonly groupsService: GroupsService) {
    super(groupsService);
  }
}

import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { GroupsEtlService } from './groups-etl.service';

@Processor(QUEUES.GROUP)
export class GroupsProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: GroupsEtlService) {
    super(myservice);
  }
}

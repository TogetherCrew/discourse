import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';
import { QUEUES } from '../constants/queues.constants';

@Processor(QUEUES.TAG_GROUP)
export class TagGroupsProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: BaseEtlSchemaService) {
    super(myservice);
  }
}

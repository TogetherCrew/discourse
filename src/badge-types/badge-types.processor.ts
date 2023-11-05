import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';
import { QUEUES } from '../constants/queues.constants';

@Processor(QUEUES.BADGE_TYPE)
export class BadgeTypesProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: BaseEtlSchemaService) {
    super(myservice);
  }
}

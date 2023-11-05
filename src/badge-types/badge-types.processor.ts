import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from 'src/base-etl/base-etl.processor';
import { BaseEtlSchemaService } from 'src/base-etl/base-etl.service';
import { QUEUES } from 'src/constants/queues.constants';

@Processor(QUEUES.BADGE_TYPE)
export class BadgeTypesProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: BaseEtlSchemaService) {
    super(myservice);
  }
}

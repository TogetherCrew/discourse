import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';

@Processor(QUEUES.BADGE)
export class BadgesProcessor extends BaseEtlProcessor {
  constructor(private readonly baseEtlSchemaService: BaseEtlSchemaService) {
    super(baseEtlSchemaService);
  }
}

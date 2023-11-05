import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from 'src/base-etl/base-etl.processor';
import { BaseEtlSchemaService } from 'src/base-etl/base-etl.service';

@Processor(QUEUES.BADGE)
export class BadgesProcessor extends BaseEtlProcessor {
  constructor(private readonly baseEtlSchemaService: BaseEtlSchemaService) {
    super(baseEtlSchemaService);
  }
}

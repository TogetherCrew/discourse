import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { QUEUES } from '../constants/queues.constants';

@Processor(QUEUES.CATEGORY)
export class CategoriesProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: BaseEtlService) {
    super(myservice);
  }
}

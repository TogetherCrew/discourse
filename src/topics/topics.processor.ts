import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { TopicsEtlService } from './topics-etl.service';

@Processor(QUEUES.TOPIC, { concurrency: 5 })
export class TopicsProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: TopicsEtlService) {
    super(myservice);
  }
}

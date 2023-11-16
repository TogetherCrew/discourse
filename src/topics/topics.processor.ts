import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { TopicsService } from './topics.service';

@Processor(QUEUES.TOPIC, { concurrency: 2 })
export class TopicsProcessor extends BaseEtlProcessor {
  constructor(private readonly topicsService: TopicsService) {
    super(topicsService);
  }
}

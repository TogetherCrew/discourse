import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { TagsService } from './tags.service';

@Processor(QUEUES.TAG, { concurrency: 2 })
export class TagsProcessor extends BaseEtlProcessor {
  constructor(private readonly tagsService: TagsService) {
    super(tagsService);
  }
}

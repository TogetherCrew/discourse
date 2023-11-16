import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { TagGroupsService } from './tag-groups.service';

@Processor(QUEUES.TAG_GROUP, { concurrency: 2 })
export class TagGroupsProcessor extends BaseEtlProcessor {
  constructor(private readonly tagGroupsService: TagGroupsService) {
    super(tagGroupsService);
  }
}

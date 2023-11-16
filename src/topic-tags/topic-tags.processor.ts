import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { TopicTagsService } from './topic-tags.service';

@Processor(QUEUES.TOPIC_TAGS, { concurrency: 20 })
export class TopicTagsProcessor extends BaseEtlProcessor {
  constructor(private readonly topicTagsService: TopicTagsService) {
    super(topicTagsService);
  }
}

import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { PostsService } from './posts.service';

@Processor(QUEUES.POST, { concurrency: 2 })
export class PostsProcessor extends BaseEtlProcessor {
  constructor(private readonly postsService: PostsService) {
    super(postsService);
  }
}

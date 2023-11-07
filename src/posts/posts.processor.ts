import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { QUEUES } from '../constants/queues.constants';
import { PostsEtlService } from './posts-etl.service';

@Processor(QUEUES.POST, { concurrency: 5 })
export class PostsProcessor extends BaseEtlProcessor {
  constructor(private readonly myservice: PostsEtlService) {
    super(myservice);
  }
}

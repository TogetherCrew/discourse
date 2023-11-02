import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  EXTRACT_JOB,
  LOAD_JOB,
  TRANSFORM_JOB,
} from 'src/constants/jobs.contants';
import { BadgeExtractHandler } from './handlers/badge-extract.handler';
import { BadgeLoadHandler } from './handlers/badge-load.handler';
import { BadgeTransformHandler } from './handlers/badge-transform.handler';

@Processor(BADGE_QUEUE)
export class BadgeProcessor extends WorkerHost {
  constructor(
    private readonly extractHandler: BadgeExtractHandler,
    private readonly transformHandler: BadgeTransformHandler,
    private readonly loadHandler: BadgeLoadHandler,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case EXTRACT_JOB:
        this.extractHandler.process(job);
        break;
      case TRANSFORM_JOB:
        this.transformHandler.process(job);
        break;
      case LOAD_JOB:
        this.loadHandler.process(job);
        break;
      default:
        break;
    }
  }
}

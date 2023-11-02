import { BADGE_QUEUE } from '../constants/queues.constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  EXTRACT_JOB,
  LOAD_JOB,
  TRANSFORM_JOB,
} from '../constants/jobs.contants';
import { BadgesExtractHandler } from './handlers/badges-extract.handler';
import { BadgesLoadHandler } from './handlers/badges-load.handler';
import { BadgesTransformHandler } from './handlers/badges-transform.handler';

@Processor(BADGE_QUEUE)
export class BadgesProcessor extends WorkerHost {
  constructor(
    private readonly extractHandler: BadgesExtractHandler,
    private readonly transformHandler: BadgesTransformHandler,
    private readonly loadHandler: BadgesLoadHandler,
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

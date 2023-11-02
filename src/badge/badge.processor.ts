import { BADGE_QUEUE } from 'src/constants/queues';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(BADGE_QUEUE)
export class BadgeProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    // do something
    console.log('JobId:', job.id);
  }
}

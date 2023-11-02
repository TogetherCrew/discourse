import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';

export class BadgeExtractHandler extends Handler {
  process(job: Job<any, any, string>): Promise<any> {
    console.log('BadgeExtractHandler', job.id);
    throw new Error('Method not implemented.');
  }
}

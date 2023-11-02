import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';

export class BadgeLoadHandler extends Handler {
  process(job: Job<any, any, string>): Promise<any> {
    console.log('BadgeLoadHandler', job.id);
    throw new Error('Method not implemented.');
  }
}

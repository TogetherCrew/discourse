import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';

export class BadgesLoadHandler extends Handler {
  process(job: Job<any, any, string>): Promise<any> {
    console.log('BadgesLoadHandler', job.id);
    throw new Error('Method not implemented.');
  }
}

import { Job } from 'bullmq';
import { Handler } from '../../abstracts/handler.abstract';

export class BadgeTransformHandler extends Handler {
  process(job: Job<any, any, string>): Promise<any> {
    console.log('BadgeTransformHandler', job.id);
    throw new Error('Method not implemented.');
  }
}

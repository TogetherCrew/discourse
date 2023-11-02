import { Job } from 'bullmq';
import { Handler } from 'src/abstracts/handler.abstract';

export class BadgeExtractHandler extends Handler {
  process(job: Job<any, any, string>): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

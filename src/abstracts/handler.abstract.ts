import { Job } from 'bullmq';

export abstract class Handler {
  abstract process(job: Job<any, any, string>): Promise<any>;
}

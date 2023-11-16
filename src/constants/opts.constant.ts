import { DefaultJobOptions } from 'bullmq';

export const DEFAULT_JOB_OPTS: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 3000,
  },
};

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '@app/discourse/constants';
import { Job, Queue } from 'bullmq';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(@InjectQueue(QUEUES.CRON) private readonly cronQueue: Queue) { }

  async addJob(data: any): Promise<Job> {
    const job = await this.cronQueue.add('cronJob', data, {
      repeat: { every: 24 * 60 * 60 * 1000 },
      jobId: data.id,
    });
    this.logger.debug(`Cron job added with ID: ${job.id}`);
    return job;
  }
}

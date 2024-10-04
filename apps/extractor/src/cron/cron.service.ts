import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '@app/discourse/constants';
import { Job, Queue } from 'bullmq';
import { Services } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @Inject(Services.mongo.name) private readonly mongoClient: ClientProxy,
    @InjectQueue(QUEUES.CRON) private readonly cronQueue: Queue,
  ) { }

  async addJob(data: any): Promise<Job> {
    const job = await this.cronQueue.add('cronJob', data, {
      repeat: { every: 5 * 60 * 1000 },
    });
    this.logger.log(`Cron job added with ID: ${job.id}`);
    return job;
  }
}

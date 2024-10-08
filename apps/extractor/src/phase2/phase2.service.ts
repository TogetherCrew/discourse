import { Patterns, Services } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';
import { AirflowService } from '../airflow/airflow.service';
import { PlatformDocument } from 'apps/mongo/src/schemas/platform.schema';
import { CronService } from '../cron/cron.service';

@Injectable()
export class Phase2Service {
  private readonly logger = new Logger(Phase2Service.name);

  constructor(
    @Inject(Services.mongo.name) private readonly mongoClient: ClientProxy,
    private readonly airflowService: AirflowService,
    private readonly cronService: CronService,
  ) { }

  async handleJob(job: Job<any, any, any>): Promise<any> {
    const { platform } = job.data;
    this.logger.debug(`platform: ${platform}`);
    this.mongoClient.emit(Patterns.Mongo.Platform.UpdateOne, {
      filter: { _id: (platform as PlatformDocument).id },
      update: {
        $set: { 'metadata.extraction.completedAt': new Date() },
      },
    });
    await this.cronService.addJob({ id: (platform as PlatformDocument).id });
    await this.airflowService.dagRuns(platform);
  }
}

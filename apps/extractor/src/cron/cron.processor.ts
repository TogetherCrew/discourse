import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Patterns, Services } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { QUEUES } from '@app/discourse/constants';
import { CronService } from './cron.service';
import { PlatformDocument } from 'apps/mongo/src/schemas/platform.schema';
import { Job } from 'bullmq';
import { ExtractorService } from '../extractor/extractor.service';

@Processor(QUEUES.CRON, {
  concurrency: 10,
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: { age: 24 * 3600 },
})
export class CronProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(CronProcessor.name);

  constructor(
    private readonly cronService: CronService,
    @Inject(Services.mongo.name) private readonly mongoClient: ClientProxy,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
    private readonly extractorService: ExtractorService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { id } = job.data;
    const platform = await this.getPlatform(id);
    const endpoint = platform.metadata.id;
    const from_topic_id = await this.getLastestStoredTopicId(endpoint);
    const from_post_id = await this.getLastestStoredPostId(endpoint);
    this.logger.debug({ endpoint, from_topic_id, from_post_id });
    return await this.extractorService.extract(id, from_topic_id, from_post_id);
  }

  async onModuleInit() {
    this.logger.debug('onModuleInit');
    const ids = await this.getAllPlatformIds();
    this.logger.debug({ ids });
    await this.addJobs(ids);
  }

  private async addJobs(ids: string[]) {
    ids.forEach(async (id) => {
      this.cronService.addJob({ id });
    });
  }

  private async getAllPlatformIds(
    skip = 0,
    limit = 1000,
    agg: string[] = [],
  ): Promise<string[]> {
    const batch: string[] = await firstValueFrom(
      this.mongoClient.send(Patterns.Mongo.Platform.Find, {
        filter: { name: 'discourse' },
        projection: { _id: 1 },
        options: {
          skip,
          limit,
        },
      }),
    );
    agg.push(...batch.map((obj) => obj['_id']));
    if (batch.length < limit) {
      return agg;
    } else {
      return this.getAllPlatformIds(skip + limit, limit, agg);
    }
  }

  private async getPlatform(id: string): Promise<PlatformDocument> {
    const platform: PlatformDocument = await firstValueFrom(
      this.mongoClient.send(Patterns.Mongo.Platform.FindById, { id }),
    );
    return platform;
  }

  private async getLastestStoredTopicId(endpoint: string): Promise<number> {
    this.logger.debug('getLastestStoredTopicId', endpoint);
    const latestStoredTopicId = await firstValueFrom(
      this.graphClient.send(Patterns.Graph.Topic.LatestById, { endpoint }),
    );
    this.logger.debug(`latestStoredTopicId: ${latestStoredTopicId}`);
    return latestStoredTopicId;
  }

  private async getLastestStoredPostId(endpoint: string): Promise<number> {
    this.logger.debug('getLastestStoredPostId', endpoint);
    const latestStoredPostId = await firstValueFrom(
      this.graphClient.send(Patterns.Graph.Post.LatestById, { endpoint }),
    );
    this.logger.debug(`latestStoredPostId: ${latestStoredPostId}`);
    return latestStoredPostId;
  }
}

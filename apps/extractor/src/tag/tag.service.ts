import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(
    job: Job<BaseData, any, typeof JOBS.TAG_GROUP>,
  ): Promise<any> {
    const { endpoint } = job.data;
    const {
      data: { tags },
    } = await this.discourseService.getTags(endpoint);
    this.logger.debug(`Tags: ${tags.length}`);
    for (const tag of tags) {
      await this.graphClient.emit(Patterns.Graph.Tag.Create, {
        tag,
        endpoint,
      });
    }
  }
}

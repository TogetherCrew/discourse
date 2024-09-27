import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class TagGroupService {
  private readonly logger = new Logger(TagGroupService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(
    job: Job<BaseData, any, typeof JOBS.TAG_GROUP>,
  ): Promise<any> {
    const { endpoint } = job.data;
    const {
      data: { tag_groups },
    } = await this.discourseService.getTagGroups(endpoint);
    this.logger.debug(`TagGroups: ${tag_groups.length}`);
    for (const tag_group of tag_groups) {
      await this.graphClient.emit(Patterns.Graph.TagGroup.Create, {
        tag_group,
        endpoint,
      });
    }
  }
}

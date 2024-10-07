import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<any, any, typeof JOBS.GROUP>): Promise<any> {
    const { endpoint } = job.data;
    await this.getGroups(endpoint);
  }

  private async getGroups(endpoint, page = 0, total = 0): Promise<void> {
    const {
      data: { groups, total_rows_groups },
    } = await this.discourseService.getGroups(endpoint, page);

    for (const group of groups) {
      await this.graphClient.emit(Patterns.Graph.Group.Create, {
        group,
        endpoint,
      });
    }

    total += groups.length;
    if (total < total_rows_groups) {
      await this.getGroups(page++, total);
    }
  }
}

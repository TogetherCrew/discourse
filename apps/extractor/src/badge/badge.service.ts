import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<BaseData, any, typeof JOBS.BADGE>): Promise<any> {
    const { endpoint } = job.data;
    const {
      data: { badges, badge_groupings, badge_types },
    } = await this.discourseService.getBadges(endpoint);

    for (const badge_grouping of badge_groupings) {
      this.graphClient.emit(Patterns.Graph.BadgeGrouping.Create, {
        badge_grouping,
        endpoint,
      });
    }
    for (const badge_type of badge_types) {
      this.graphClient.emit(Patterns.Graph.BadgeType.Create, {
        badge_type,
        endpoint,
      });
    }
    for (const badge of badges) {
      this.graphClient.emit(Patterns.Graph.Badge.Create, {
        badge,
        endpoint,
      });
    }
  }
}

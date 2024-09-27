import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<TopicData, any, typeof JOBS.TOPIC>): Promise<any> {
    const { endpoint, id } = job.data;
    const { data: topic } = await this.discourseService.getTopic(endpoint, id);
    this.graphClient.emit(Patterns.Graph.Topic.Create, { topic, endpoint });
  }
}

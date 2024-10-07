import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<PostData, any, typeof JOBS.POST>): Promise<any> {
    const { endpoint, id } = job.data;
    const { data: post } = await this.discourseService.getPost(endpoint, id);
    await this.graphClient.emit(Patterns.Graph.Post.Create, { post, endpoint });
  }
}

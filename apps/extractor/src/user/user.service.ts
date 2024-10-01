import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<any, any, typeof JOBS.GROUP>): Promise<any> {
    const { endpoint, username } = job.data;
    const {
      data: { user },
    } = await this.discourseService.getUser(endpoint, username);
    this.graphClient.emit(Patterns.Graph.User.Create, { endpoint, user });

    const {
      data: { user_actions },
    } = await this.discourseService.getUserActions(endpoint, username);

    user_actions.forEach((user_action) =>
      this.graphClient.emit(Patterns.Graph.UserAction.Create, {
        endpoint,
        user_action,
      }),
    );
  }
}

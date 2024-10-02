import { Patterns, Services } from '@app/common';
import { FLOW_PRODUCER, JOBS, QUEUES } from '@app/discourse/constants';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FlowChildJob, FlowProducer, Job } from 'bullmq';
import { firstValueFrom, timeout } from 'rxjs';

const opts = {
  attempts: 2,
  removeOnFail: true,
  failParentOnFailure: false,
};

@Injectable()
export class Phase1Service {
  private readonly logger = new Logger(Phase1Service.name);

  constructor(
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
    @InjectFlowProducer(FLOW_PRODUCER)
    private readonly flowProducer: FlowProducer,
  ) { }

  async handleJob(job: Job<any, any, typeof JOBS.GROUP>): Promise<any> {
    const { endpoint } = job.data;
    const usernames: string[] = await this.getUsernames(endpoint);

    const children: FlowChildJob[] = usernames.map(
      (username: string) =>
        ({
          name: JOBS.USER,
          queueName: QUEUES.EXTRACT,
          data: { endpoint, username },
          opts,
        }) as FlowChildJob,
    );

    await this.flowProducer.add({
      name: JOBS.PHASE_2,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      children,
      opts,
    });
  }

  private async getUsernames(
    endpoint: string,
    usernames = [],
    skip = 0,
    limit = 1000,
  ): Promise<string[]> {
    const data: string[] = await firstValueFrom(
      this.graphClient
        .send(Patterns.Graph.User.GetUniqueUsersByPosts, {
          endpoint,
          skip,
          limit,
        })
        .pipe(timeout(5000)),
    );

    usernames = [...usernames, ...data];

    if (data.length === limit) {
      usernames = await this.getUsernames(
        endpoint,
        usernames,
        skip + limit,
        limit,
      );
    }

    return usernames;
  }
}

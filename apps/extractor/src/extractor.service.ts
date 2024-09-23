import { Injectable } from '@nestjs/common';
import { ExtractDto } from './dto/extract.dto';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FLOW_PRODUCER, JOBS, QUEUES } from '@app/discourse/constants';
import { FlowChildJob, FlowProducer } from 'bullmq';
import { DiscourseService } from '@app/discourse';

const opts = {
  attempts: 2,
  removeOnFail: true,
  failParentOnFailure: false,
};

@Injectable()
export class ExtractorService {
  constructor(
    @InjectFlowProducer(FLOW_PRODUCER)
    private readonly flowProducer: FlowProducer,
    private readonly discourseService: DiscourseService,
  ) { }

  async extract({ endpoint }: ExtractDto): Promise<any> {
    const node = await this.flowProducer.add({
      name: JOBS.EXTRACT,
      queueName: QUEUES.EXTRACT,
      children: [
        // ...(await this.createJobs(
        //   endpoint,
        //   JOBS.TOPIC,
        //   QUEUES.EXTRACT,
        //   await this.getLatestTopicId(endpoint),
        // )),
        // ...(await this.createJobs(
        //   endpoint,
        //   JOBS.POST,
        //   QUEUES.EXTRACT,
        //   await this.getLatestPostId(endpoint),
        // )),
        this.createBadgeJob(endpoint),
      ],
    });
    return node.job.id;
  }

  private async createJobs(
    endpoint: string,
    name: string,
    queueName: string,
    n: number,
  ): Promise<FlowChildJob[]> {
    const array = [...Array(n + 1).keys()];
    const reversed = array.reverse();
    return reversed.map((id) => ({
      name,
      queueName,
      data: { endpoint, id },
      opts,
    }));
  }

  private createBadgeJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.BADGE,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      opts,
    };
  }

  private async getLatestTopicId(endpoint: string): Promise<number> {
    const { data } = await this.discourseService.getLatestTopics(
      endpoint,
      0,
      'created',
    );
    const { topic_list } = data;
    const { topics } = topic_list;
    const topicIds = topics.map((topic) => topic.id);
    return Math.max(...topicIds);
  }

  private async getLatestPostId(endpoint: string): Promise<number> {
    const { data } = await this.discourseService.getLatestPosts(endpoint);
    const { latest_posts } = data;
    const postIds = latest_posts.map((post) => post.id);
    return Math.max(...postIds);
  }
}

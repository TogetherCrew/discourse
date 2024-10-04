import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExtractDto } from './dto/extract.dto';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FLOW_PRODUCER, JOBS, QUEUES } from '@app/discourse/constants';
import { FlowChildJob, FlowProducer } from 'bullmq';
import { DiscourseService } from '@app/discourse';
import { Patterns, Services } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PlatformDocument } from 'apps/mongo/src/schemas/platform.schema';

const opts = {
  attempts: 2,
  removeOnFail: true,
  failParentOnFailure: false,
};

@Injectable()
export class ExtractorService {
  private readonly logger = new Logger(ExtractorService.name);

  constructor(
    @InjectFlowProducer(FLOW_PRODUCER)
    private readonly flowProducer: FlowProducer,
    private readonly discourseService: DiscourseService,
    @Inject(Services.mongo.name) private readonly mongoClient: ClientProxy,
  ) { }

  async extract(
    platform_id: string,
    from_topic_id = 0,
    from_post_id = 0,
  ): Promise<any> {
    this.logger.debug(platform_id);

    const platform: PlatformDocument = await firstValueFrom(
      this.mongoClient.send(Patterns.Mongo.Platform.FindById, {
        id: platform_id,
      }),
    );
    this.logger.debug(platform);
    const endpoint = platform.metadata.id;

    this.mongoClient.emit(Patterns.Mongo.Platform.UpdateOne, {
      filter: { _id: platform_id },
      update: {
        $set: {
          'metadata.extraction.startedAt': new Date(),
        },
      },
    });

    const node = await this.flowProducer.add({
      name: JOBS.PHASE_1,
      queueName: QUEUES.EXTRACT,
      data: { endpoint, platform },
      opts: { ...opts, removeOnFail: false },
      children: [
        ...(await this.createJobs(
          endpoint,
          JOBS.TOPIC,
          QUEUES.EXTRACT,
          from_topic_id,
          await this.getLatestTopicId(endpoint),
        )),
        ...(await this.createJobs(
          endpoint,
          JOBS.POST,
          QUEUES.EXTRACT,
          from_post_id,
          await this.getLatestPostId(endpoint),
        )),
        this.createCategoryJob(endpoint),
        // this.createBadgeJob(endpoint),
        // this.createGroupJob(endpoint),
        // this.createTagGroupJob(endpoint),
        // this.createTagJob(endpoint),
      ],
    });
    return node.job.id;
  }

  private async createJobs(
    endpoint: string,
    name: string,
    queueName: string,
    from: number,
    to: number,
  ): Promise<FlowChildJob[]> {
    if (to <= from) {
      throw new Error(`to (${to}) must be greater than from (${from}).`);
    }
    const array = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const reversed = array.reverse();
    return reversed.map((id) => ({
      name,
      queueName,
      data: { endpoint, id },
      opts,
    }));
  }

  private createTagJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.TAG,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      opts,
    };
  }
  private createTagGroupJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.TAG_GROUP,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      opts,
    };
  }
  private createBadgeJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.BADGE,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      opts,
    };
  }
  private createCategoryJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.CATEGORY,
      queueName: QUEUES.EXTRACT,
      data: { endpoint },
      opts,
    };
  }
  private createGroupJob(endpoint: string): FlowChildJob {
    return {
      name: JOBS.GROUP,
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

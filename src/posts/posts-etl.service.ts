import { FlowProducer, Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { Injectable } from '@nestjs/common';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FLOWS } from '../constants/flows.constants';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';

@Injectable()
export class PostsEtlService extends BaseEtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOWS.POST_TL)
    private readonly flowProducer: FlowProducer,
  ) {
    super(discourseService, baseTransformerService, neo4jService);
  }

  async extract(job: Job<any, any, string>): Promise<any> {
    console.log('PostsEtlService.extract');
    const { forum } = job.data as EtlDto;
    const topicIds = await this.getTopicIds(job);
    console.log('topicIds', topicIds.length);
    return this.iterate(forum, topicIds);
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    const { forum, posts } = job.data;
    console.log('posts', posts.length);
    const array = posts.map((i) => {
      const obj = this.baseTransformerService.transform(i, {
        forum_uuid: forum.uuid,
      });
      delete obj.linkCounts;
      delete obj.actionsSummary;
      delete obj.mentionedUsers;
      delete obj.replyToUser;
      delete obj.polls;
      return obj;
    });
    return array;
  }

  private async iterate(forum: Forum, topicIds: number[]) {
    topicIds.forEach(async (id) => {
      const posts = await this.getPosts(forum.endpoint, id);
      await this.flowProducer.add({
        name: JOBS.LOAD,
        queueName: QUEUES.POST,
        opts: { priority: 2 },
        data: { forum, cypher: CYPHERS.BULK_CREATE_POST },
        children: [
          {
            name: JOBS.TRANSFORM,
            queueName: QUEUES.POST,
            opts: { priority: 1 },
            data: { forum, posts },
          },
        ],
      });
    });
  }

  private async getTopicIds(job: Job) {
    const childrenValues = await super.getChildrenValues(job);
    return childrenValues.map((child) => child.id);
  }

  private async getPosts(endpoint: string, topicId: number) {
    const { data } = await this.discourseService.getPosts(endpoint, topicId);
    const {
      post_stream: { posts },
    } = data as PostsResponse;
    console.log(`Topic ${topicId}, Posts: ${posts.length}`);
    return posts;
  }
}

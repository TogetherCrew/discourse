import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';

@Injectable()
export class PostsService extends EtlService {
  async extract(job: Job<any, any, string>): Promise<any> {
    const { forum, topics } = job.data;
    this.iterate(
      forum,
      topics.map((t) => t.id),
    );
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    const { forum, posts } = job.data;
    const batch = posts.map((i) => {
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

    await this.flowProducer.add({
      name: JOBS.LOAD,
      queueName: QUEUES.POST,
      data: { batch },
    });
  }

  async load(job: Job<any, any, string>): Promise<any> {
    const { batch } = job.data;
    await this.neo4jService.write(CYPHERS.BULK_CREATE_POST, { batch });
  }

  private async iterate(forum: Forum, topicIds: number[]) {
    topicIds.forEach(async (id) => {
      try {
        const posts = await this.getPosts(forum.endpoint, id);
        await this.flowProducer.add({
          name: JOBS.TRANSFORM,
          queueName: QUEUES.POST,
          data: { forum, posts },
        });
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  private async getPosts(endpoint: string, topicId: number) {
    const { data } = await this.discourseService.getPosts(endpoint, topicId);
    const {
      post_stream: { posts },
    } = data as PostsResponse;
    return posts;
  }
}

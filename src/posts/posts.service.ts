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
    try {
      const { forum, topics } = job.data;
      this.iterate(
        forum,
        topics.map((t) => t.id),
      );
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    try {
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
        queueName: QUEUES.LOAD,
        name: JOBS.POST,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_POST, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async iterate(forum: Forum, topicIds: number[]) {
    try {
      topicIds.forEach(async (id) => {
        try {
          const posts = await this.getPosts(forum.endpoint, id);
          await this.flowProducer.add({
            queueName: QUEUES.TRANSFORM,
            name: JOBS.POST,
            data: { forum, posts },
          });
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  }

  private async getPosts(endpoint: string, topicId: number) {
    try {
      const { data } = await this.discourseService.getPosts(endpoint, topicId);
      const {
        post_stream: { posts },
      } = data as PostsResponse;
      return posts;
    } catch (error) {
      throw error;
    }
  }
}

import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { AxiosError } from 'axios';

const BATCH_SIZE = 20;

type PostExtractDto = {
  forum: Forum;
  postId: number;
};

type PostTransformDto = {
  forum: Forum;
  data: Post;
};

type PostLoad = {
  id: number;
  topicId: number;
  userId: number;
  username: string;
  userDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  postType: number;
  postNumber: number;
  replyToPostNumber?: number;
  hidden: boolean;
  cooked: string;
  raw: string;
  score: number;
  forumUuid: string;
};

type PostLoadDto = {
  post: any;
};

@Injectable()
export class PostsService extends EtlService {
  async extract(job: Job<PostExtractDto, any, string>): Promise<any> {
    try {
      const { forum, postId } = job.data;

      const { data } = await this.discourseService.getPost(
        forum.endpoint,
        postId,
      );

      await this.flowProducer.add({
        name: JOBS.POST,
        queueName: QUEUES.TRANSFORM,
        data: { forum, data },
      });

      // this.iterate(forum, topic);
    } catch (error) {
      job.log(error.message);
      const err = error as AxiosError;
      switch (err.response.status) {
        case 404:
          return;
        default:
          throw error;
      }
    }
  }

  async transform(job: Job<PostTransformDto, any, string>): Promise<any> {
    try {
      const { forum, data } = job.data;

      const post: PostLoad = {
        id: data.id,
        topicId: data.topic_id,
        userId: data.user_id,
        username: data.username,
        userDeleted: data.user_deleted,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at,
        postType: data.post_type,
        postNumber: data.post_number,
        replyToPostNumber: data.reply_to_post_number,
        hidden: data.hidden,
        cooked: data.cooked,
        raw: data.raw,
        score: data.score,
        forumUuid: forum.uuid,
      };

      const { username } = data;

      await this.flowProducer.addBulk([
        {
          name: JOBS.POST,
          queueName: QUEUES.LOAD,
          data: { post },
        },
        {
          name: JOBS.USER,
          queueName: QUEUES.EXTRACT,
          data: { forum, username },
          opts: { priority: 8 },
        },
      ]);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<PostLoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.CREATE_POST, job.data);
      await this.neo4jService.write(CYPHERS.CREATE_POST_USER, job.data);
      await this.neo4jService.write(CYPHERS.CREATE_REPLIED_TO_EDGE, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  // private async iterate(forum: Forum, topic: Topic) {
  //   const count = Math.ceil(topic.posts_count / BATCH_SIZE);
  //   if (count > 1) {
  //     console.log(`${topic.id} has ${topic.posts_count} posts.`);
  //   }
  //   [...Array<number>(count)].forEach(async (_, index) => {
  //     try {
  //       const posts = await this.getPosts(forum.endpoint, topic.id, index + 1);
  //       if (posts.length > 0) {
  //         await this.flowProducer.add({
  //           queueName: QUEUES.TRANSFORM,
  //           name: JOBS.POST,
  //           data: { forum, posts },
  //         });
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   });
  // }

  // private async getPosts(endpoint: string, topicId: number, page: number = 1) {
  //   try {
  //     const { data } = await this.discourseService.getPosts(
  //       endpoint,
  //       topicId,
  //       page,
  //     );
  //     const {
  //       post_stream: { posts },
  //     } = data as PostsResponse;
  //     return posts;
  //   } catch (error) {
  //     const err = error as AxiosError;
  //     switch (err.response.status) {
  //       case 404:
  //         return [];
  //       default:
  //         throw error;
  //     }
  //   }
  // }
}

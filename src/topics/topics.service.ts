import { FlowJob, Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { handleError } from '../errorHandler';

type TopicTransformDto = {
  forum: Forum;
  data: Topic;
};

type TopicLoad = {
  id: number;
  title: string;
  fancyTitle: string;
  slug: string;
  createdAt: Date;
  deletedAt: Date;
  imageUrl: string;
  proposalId?: number;
  voteType?: string;
  categoryId: number;
  forumUuid: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
};

type TopicLoadDto = {
  topic: TopicLoad;
};

@Injectable()
export class TopicsService extends EtlService {
  async extract(job: Job<any, any, string>): Promise<any> {
    try {
      const { forum, topicId } = job.data;
      const { data } = await this.discourseService.getTopic(
        forum.endpoint,
        topicId,
      );
      await this.flowProducer.add({
        name: JOBS.TOPIC,
        queueName: QUEUES.TRANSFORM,
        data: { forum, data },
      });
    } catch (error) {
      job.log(error.message);
      handleError(error);
    }
  }

  async transform(job: Job<TopicTransformDto, any, string>): Promise<any> {
    try {
      const { forum, data } = job.data;

      const topic = {
        id: data.id,
        title: data.title,
        fancyTitle: data.fancy_title,
        slug: data.slug,
        createdAt: data.created_at,
        deletedAt: data.deleted_at,
        imageUrl: data.image_url,
        // proposalId
        // voteType
        categoryId: data.category_id,
        forumUuid: forum.uuid,
        visible: data.visible,
        closed: data.closed,
        archived: data.archived,
      };

      const tagIds = data.tags;

      const postIds = data.post_stream.stream;

      await this.flowProducer.addBulk([
        {
          name: JOBS.TOPIC,
          queueName: QUEUES.LOAD,
          data: { topic, tagIds },
        },
        ...postIds.map(
          (postId) =>
            ({
              name: JOBS.POST,
              queueName: QUEUES.EXTRACT,
              data: { forum, postId },
              opts: { priority: 9 },
            }) as FlowJob,
        ),
      ]);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<TopicLoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.CREATE_TOPIC, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  // private async iterate(forum: Forum, page = 0) {
  //   try {
  //     const { data } = await this.discourseService.getLatestTopics(
  //       forum.endpoint,
  //       page,
  //       'created',
  //     );
  //     const { topic_list, users }: TopicsResponse = data;
  //     const { topics, more_topics_url } = topic_list;

  //     await this.flowProducer.addBulk([
  //       ...topics.map((topic) => ({
  //         queueName: QUEUES.EXTRACT,
  //         name: JOBS.POST,
  //         data: { forum, topic },
  //       })),
  //       {
  //         queueName: QUEUES.TRANSFORM,
  //         name: JOBS.USER,
  //         data: { forum, users },
  //       },
  //       {
  //         queueName: QUEUES.TRANSFORM,
  //         name: JOBS.TOPIC,
  //         data: { forum, topics },
  //       },
  //       {
  //         queueName: QUEUES.TRANSFORM,
  //         name: JOBS.TOPIC_TAG,
  //         data: { forum, topics },
  //       },
  //     ]);

  //     if (more_topics_url) {
  //       return await this.iterate(forum, page + 1);
  //     } else {
  //       return;
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

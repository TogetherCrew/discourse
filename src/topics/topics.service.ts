import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';

@Injectable()
export class TopicsService extends EtlService {
  async extract(job: Job<any, any, string>): Promise<any> {
    try {
      const { forum } = job.data;
      return this.iterate(forum);
    } catch (error) {
      job.log(error.message);
    }
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    try {
      const { forum, topics } = job.data;
      const batch = topics.map((i) => {
        const obj = this.baseTransformerService.transform(i, {
          forum_uuid: forum.uuid,
        });
        delete obj.posters;
        delete obj.tags;
        delete obj.tagsDescriptions;
        delete obj.acceptedAnswer;
        delete obj.details;
        delete obj.thumbnails;
        delete obj.bookmarks;
        delete obj.timelineLookup;
        delete obj.suggestedTopics;
        delete obj.actionSummary;
        return obj;
      });

      await this.flowProducer.add({
        name: JOBS.TOPIC,
        queueName: QUEUES.LOAD,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_TOPIC, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async iterate(forum: Forum, page = 0) {
    try {
      const { data } = await this.discourseService.getLatestTopics(
        forum.endpoint,
        page,
        'created',
      );
      const { topic_list, users }: TopicsResponse = data;
      const { topics, more_topics_url } = topic_list;

      await this.flowProducer.addBulk([
        ...topics.map((topic) => ({
          queueName: QUEUES.EXTRACT,
          name: JOBS.POST,
          data: { forum, topic },
        })),
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.USER,
          data: { forum, users },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.TOPIC,
          data: { forum, topics },
        },
        {
          queueName: QUEUES.TRANSFORM,
          name: JOBS.TOPIC_TAG,
          data: { forum, topics },
        },
      ]);

      if (more_topics_url) {
        return await this.iterate(forum, page + 1);
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }
}

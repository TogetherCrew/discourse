import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { Injectable } from '@nestjs/common';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';

@Injectable()
export class TopicsService extends EtlService {
  async extract(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    return this.iterate(forum);
  }

  async transform(job: Job<any, any, string>): Promise<any> {
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
      name: JOBS.LOAD,
      queueName: QUEUES.TOPIC,
      data: { batch },
    });
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_TOPIC, job.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  private async iterate(forum: Forum, page = 0) {
    const { data } = await this.discourseService.getLatestTopics(
      forum.endpoint,
      page,
      'created',
    );
    const { topic_list, users }: TopicsResponse = data;
    const { topics, more_topics_url } = topic_list;

    await this.flowProducer.addBulk([
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.POSTS,
        data: { forum, topics },
      },
      {
        queueName: QUEUES.USER,
        name: JOBS.TRANSFORM,
        data: { forum, users },
      },
      {
        queueName: QUEUES.TOPIC,
        name: JOBS.TRANSFORM,
        data: { forum, topics },
      },
      {
        queueName: QUEUES.TOPIC_TAGS,
        name: JOBS.TRANSFORM,
        data: { forum, topics },
      },
    ]);

    if (more_topics_url) {
      return await this.iterate(forum, page + 1);
    } else {
      return;
    }
  }
}
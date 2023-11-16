import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { Job } from 'bullmq';
import { Forum } from '../forums/entities/forum.entity';

type TransformDto = {
  forum: Forum;
  topics: Topic[];
};

type TopicTag = {
  topicId: number;
  tagId: string;
  forumUuid: string;
};

@Injectable()
export class TopicTagsService extends EtlService {
  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    try {
      const { forum, topics } = job.data;
      const batch: TopicTag[] = [];

      topics.forEach((topic) => {
        topic.tags.forEach((tagId) => {
          batch.push({
            forumUuid: forum.uuid,
            tagId: tagId,
            topicId: topic.id,
          });
        });
      });

      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.TOPIC_TAG,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_TOPIC_TAG, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

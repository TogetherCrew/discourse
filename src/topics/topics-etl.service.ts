import { FlowJob, FlowProducer, Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { Injectable } from '@nestjs/common';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { FLOWS } from '../constants/flows.constants';
import { DiscourseService } from '@app/discourse';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';

@Injectable()
export class TopicsEtlService extends BaseEtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOWS.TOPIC_TL)
    private readonly flowProducer: FlowProducer,
  ) {
    super(discourseService, baseTransformerService, neo4jService);
  }

  async extract(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    return this.iterate(forum);
  }

  async transform(job: Job<any, any, string>): Promise<any> {
    const { forum, topics } = job.data;
    const array = topics.map((i) => {
      const obj = this.baseTransformerService.transform(i, {
        forum_uuid: forum.uuid,
      });
      delete obj.posters;
      delete obj.tags;
      delete obj.tagsDescriptions;
      return obj;
    });
    return array;
  }

  private async iterate(forum: Forum, page = 0) {
    console.log(`Topics page: ${page}`);
    const { data } = await this.discourseService.getLatestTopics(
      forum.endpoint,
      page,
      'created',
    );
    const { topic_list }: TopicsResponse = data;
    const { topics, more_topics_url } = topic_list;

    const flow = this.flowExtractPosts(forum, topics);
    await this.flowProducer.add(flow);

    if (more_topics_url) {
      return await this.iterate(forum, page + 1);
    } else {
      return;
    }
  }

  private flowExtractPosts(forum: Forum, topics: Topic[]): FlowJob {
    return {
      name: JOBS.EXTRACT,
      queueName: QUEUES.POST,
      data: { forum },
      children: [this.flowLoadTopics(forum, topics)],
      // opts: { priority: 1 },
    };
  }

  private flowLoadTopics(forum: Forum, topics: Topic[]): FlowJob {
    return {
      name: JOBS.LOAD,
      queueName: QUEUES.TOPIC,
      data: { forum, cypher: CYPHERS.BULK_CREATE_TOPIC },
      children: [this.flowTransformTopics(forum, topics)],
      // opts: { priority: 2 },
    };
  }

  private flowTransformTopics(forum: Forum, topics: Topic[]): FlowJob {
    return {
      name: JOBS.TRANSFORM,
      queueName: QUEUES.TOPIC,
      data: { forum, topics },
      // opts: { priority: 1 },
    };
  }
}

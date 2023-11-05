import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TopicsEtlService extends BaseEtlService {
  async extract(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    return this.iterate(forum.endpoint);
  }

  private async iterate(
    endpoint: string,
    page = 0,
    agg: Topic[] = [],
  ): Promise<Topic[]> {
    const { data } = await this.discourseService.getLatestTopics(
      endpoint,
      page,
      'created',
    );
    const { topic_list }: TopicsResponse = data;
    const { topics, more_topics_url } = topic_list;
    agg = agg.concat(topics);
    if (more_topics_url) {
      return await this.iterate(endpoint, page + 1, agg);
    } else {
      return agg;
    }
  }
}

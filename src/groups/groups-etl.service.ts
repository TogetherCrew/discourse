import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { BaseEtlService } from '../base-etl/base-etl.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupsEtlService extends BaseEtlService {
  async extract(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    return this.iterate(forum.endpoint);
  }

  private async iterate(
    endpoint: string,
    page = 0,
    agg: Group[] = [],
  ): Promise<Group[]> {
    const { data } = await this.discourseService.getGroups(endpoint, page);
    const { groups, total_rows_groups }: GroupsResponse = data;
    agg = agg.concat(groups);
    if (agg.length == total_rows_groups) {
      return agg;
    } else {
      return await this.iterate(endpoint, page + 1, agg);
    }
  }
}

import { DiscourseService } from '@app/discourse';
import { Injectable } from '@nestjs/common';
import { EtlDto } from './dto/etl.dto';
import { Job } from 'bullmq';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class BaseEtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    private readonly baseTransformerService: BaseTransformerService,
    private readonly neo4jService: Neo4jService,
  ) {}

  async extract(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum, operation, property } = job.data as EtlDto;
    const { data } = await this.discourseService[operation](forum.endpoint);
    return this.getProperty(data, property);
  }
  async transform(job: Job<EtlDto, any, string>): Promise<any> {
    const { forum } = job.data as EtlDto;
    const childrenValues = await this.getChildrenValues(job);
    return childrenValues.map((i) =>
      this.baseTransformerService.transform(i, {
        forum_uuid: forum.uuid,
      }),
    );
  }
  async load(job: Job<any, any, string>): Promise<any> {
    const { cypher } = job.data as EtlDto;
    const batch = await this.getChildrenValues(job);
    await this.neo4jService.write(cypher, { batch });
  }

  private getProperty(obj: any, property: string): any {
    // Split the path into an array of keys
    const keys = property.split('.');
    // Use reduce to traverse the object using the keys
    return keys.reduce((currentObject, key) => {
      // Return undefined if the path is not valid
      return currentObject && key in currentObject
        ? currentObject[key]
        : undefined;
    }, obj);
  }

  private async getChildrenValues(job: Job): Promise<any[]> {
    const childrenValues = await job.getChildrenValues();
    return Object.values(childrenValues)[0];
  }
}

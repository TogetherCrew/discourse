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
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
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
    const array = await this.getChildrenValues(job);
    return await this.batchInsert(array, cypher);
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

  async getChildrenValues(job: Job): Promise<any[]> {
    const childrenValues = await job.getChildrenValues();
    return Object.values(childrenValues)[0];
  }

  private async batchInsert(array: any[], cypher: string, batchSize = 100) {
    console.log(
      'Items to insert:',
      array.map((obj) => obj.id),
    );
    let counter: number = 1;
    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);
      console.log('Inserting Batch', counter, batch.length);
      try {
        await this.neo4jService.write(cypher, { batch });
      } catch (error) {
        console.error(error);
      }
      console.log('Finished Batch', counter);
      counter++;
    }
    return array; // return the array so it can be used as input for the parent (if required)
  }
}

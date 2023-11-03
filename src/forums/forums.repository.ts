import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { CreateForumDto } from './dto/create-forum.dto';

@Injectable()
export class ForumsRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async insertOne(createForumDto: CreateForumDto) {
    const { endpoint } = createForumDto;

    const neoResult = await this.neo4jService.write(
      'CREATE (f:Forum { uuid: randomUUID(), endpoint: $endpoint }) RETURN f',
      { endpoint },
    );

    const record = neoResult.records[0];
    if (record) {
      return record.get('f').properties;
    } else {
      throw new Error(
        'Failed to create the forum: No record returned from the database',
      );
    }
  }
}
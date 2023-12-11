import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { CreateForumDto } from './dto/create-forum.dto';
import { Forum } from './entities/forum.entity';
import { UpdateForumDto } from './dto/update-forum.dto';

@Injectable()
export class ForumsRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async insertOne(createForumDto: CreateForumDto): Promise<Forum> {
    const { endpoint } = createForumDto;

    const neoResult = await this.neo4jService.write(
      'CREATE (f:DiscourseForum { uuid: randomUUID(), endpoint: $endpoint, createdAt: datetime(), updatedAt: datetime() }) RETURN f',
      { endpoint },
    );

    const record = neoResult.records[0];
    if (record) {
      return record.get('f').properties as Forum;
    } else {
      throw new Error(
        'Failed to create the forum: No record returned from the database',
      );
    }
  }

  async updateOne(
    uuid: string,
    updateForumDto: UpdateForumDto,
  ): Promise<Forum> {
    const neoResult = await this.neo4jService.write(
      [
        'MATCH (f:DiscourseForum { uuid: $uuid })',
        'SET',
        'f += $updateForumDto,',
        'f.updatedAt = datetime()',
        'RETURN f',
      ].join(' '),
      { uuid, updateForumDto },
    );

    const record = neoResult.records[0];
    if (record) {
      return record.get('f').properties as Forum;
    } else {
      throw new Error(
        'Failed to update the forum: No record returned from the database',
      );
    }
  }
}

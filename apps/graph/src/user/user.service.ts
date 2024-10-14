import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private readonly UNIQUE_USER_BY_POSTS = [
    'MATCH (n:DiscoursePost { endpoint: $endpoint })',
    'WITH DISTINCT n.username AS username',
    'RETURN username',
    'SKIP toInteger($skip) LIMIT toInteger($limit);',
  ].join(' ');

  private readonly CREATE = [
    'MERGE (obj:DiscourseUser { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async getUniqueUsersByUsers(
    endpoint: string,
    skip = 0,
    limit = 1000,
  ): Promise<any> {
    this.logger.debug(`endpoint: ${endpoint}`);
    this.logger.debug(this.UNIQUE_USER_BY_POSTS);
    const { records } = await this.neo4jService.read(
      this.UNIQUE_USER_BY_POSTS,
      {
        endpoint,
        skip,
        limit,
      },
    );
    return records.map((record) => record.toObject()['username']);
  }

  async create(dto: any, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    try {
      await this.neo4jService.write(this.CREATE, { obj });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`User ${dto.id} created.`);
  }
}

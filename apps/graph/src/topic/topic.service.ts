import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseTopic { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
    'WITH obj',
    'MERGE (c:DiscourseCategory { id: obj.categoryId, endpoint: obj.endpoint })',
    'MERGE (c)-[:HAS_TOPIC]->(obj)',
  ].join(' ');

  private readonly LATEST_BY_ID = [
    'MATCH (t:DiscourseTopic { endpoint: $endpoint })',
    'RETURN t.id AS id',
    'ORDER BY id DESC',
    'LIMIT 1',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Topic, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    try {
      await this.neo4jService.write(this.CREATE, { obj });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`Topic ${dto.id} created.`);
  }

  async latestById(endpoint: string) {
    try {
      const result = await this.neo4jService.read(this.LATEST_BY_ID, {
        endpoint,
      });
      return result.records[0]['_fields'][0];
    } catch (error) {
      this.logger.error(error, endpoint);
    }
  }
}

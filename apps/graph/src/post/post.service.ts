import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscoursePost { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
    'WITH obj',
    'MERGE (t:DiscourseTopic { id: obj.topicId, endpoint: obj.endpoint })',
    'MERGE (t)-[:HAS_POST]->(obj)',
    'WITH obj',
    'MERGE (u:DiscourseUser { id: obj.userId, endpoint: obj.endpoint })',
    'MERGE (u)-[:POSTED]->(obj)',
  ].join(' ');

  private readonly REPLIED_TO = [
    'MATCH (obj:DiscoursePost { endpoint: $endpoint })',
    'WHERE obj.replyToPostNumber IS NOT NULL',
    'AND obj.replyToPostNumber <> "null"',
    'WITH obj',
    'MERGE (rp:DiscoursePost { topicId: obj.topicId, postNumber: obj.replyToPostNumber, endpoint: obj.endpoint })',
    'MERGE (obj)-[:REPLIED_TO]->(rp)',
  ].join(' ');

  private readonly LATEST_BY_ID = [
    'MATCH (t:DiscoursePost { endpoint: $endpoint })',
    'WHERE t.id IS NOT NULL',
    'RETURN t.id AS id',
    'ORDER BY id DESC',
    'LIMIT 1',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Post, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    try {
      await this.neo4jService.write(this.CREATE, { obj });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`Post ${dto.id} created.`);
  }

  async updateRepliedTo(endpoint: string): Promise<void> {
    try {
      await this.neo4jService.write(this.REPLIED_TO, { endpoint });
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.debug(`Updated REPLIED_TO for ${endpoint}.`);
  }

  async latestById(endpoint: string) {
    this.logger.debug('latestById', endpoint);
    try {
      const result = await this.neo4jService.read(this.LATEST_BY_ID, {
        endpoint,
      });
      return result.records[0]['_fields'][0];
    } catch (error) {
      // this.logger.error(error, endpoint);
      return 0;
    }
  }
}

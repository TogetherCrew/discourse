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
    'WITH obj',
    'FOREACH (ignoreMe IN CASE WHEN obj.replyToPostNumber IS NOT NULL THEN [1] ELSE [] END |',
    'MERGE (rp:DiscoursePost { topicId: obj.topicId, postNumber: obj.replyToPostNumber, endpoint: obj.endpoint })',
    'MERGE (obj)-[:REPLIED_TO]->(rp)',
    ')',
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
      this.logger.error(obj);
    }
    this.logger.log(`Post ${dto.id} created.`);
  }
}

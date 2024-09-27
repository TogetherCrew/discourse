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

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Topic, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`Topic ${dto.id} created.`);
  }
}

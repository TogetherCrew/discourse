import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class TagGroupService {
  private readonly logger = new Logger(TagGroupService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseTagGroup { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj.name += $obj.name',
    'WITH obj, $obj.tags AS tags',
    'UNWIND tags AS tag',
    'MERGE (t:DiscourseTag { id: tag.id, endpoint: obj.endpoint })',
    'MERGE (obj)-[:CONTAINS]->(t)',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: TagGroup, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.debug(`TagGroup ${dto.id} created.`);
  }
}

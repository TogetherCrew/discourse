import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseBadge { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
    'WITH obj',
    'MERGE (bt:DiscourseBadgeType { id: obj.badgeTypeId, endpoint: obj.endpoint })',
    'MERGE (obj)-[:HAS_TYPE]->(bt)',
    'MERGE (bg:DiscourseBadgeGrouping { id: obj.badgeGroupingId, endpoint: obj.endpoint })',
    'MERGE (obj)-[:HAS_GROUPING]->(bg)',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Badge, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`Badge ${dto.id} created.`);
  }
}

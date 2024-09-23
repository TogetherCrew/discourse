import { Injectable } from '@nestjs/common';
import { TransformService } from './transform/transform.service.';
import { Neo4jService } from 'nest-neo4j';

const CREATE_BADGE_GROUPING = [
  'MERGE (obj:DiscourseBadgeGrouping { id: $obj.id, endpoint: $obj.endpoint })',
  'SET obj += $obj',
].join(' ');

const CREATE_BADGE_TYPE = [
  'MERGE (obj:DiscourseBadgeType { id: $obj.id, endpoint: $obj.endpoint })',
  'SET obj += $obj',
].join(' ');

const CREATE_BADGE = [
  'MERGE (obj:DiscourseBadge { id: $obj.id, endpoint: $obj.endpoint })',
  'SET obj += $obj',
  'WITH obj',
  'MERGE (bt:DiscourseBadgeType { id: obj.badgeTypeId, endpoint: obj.endpoint })',
  'MERGE (obj)-[:HAS_TYPE]->(bt)',
  'MERGE (bg:DiscourseBadgeGrouping { id: obj.badgeGroupingId, endpoint: obj.endpoint })',
  'MERGE (obj)-[:HAS_GROUPING]->(bg)',
].join(' ');

@Injectable()
export class GraphService {
  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async createBadgeGrouping(dto: BadgeGrouping, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(CREATE_BADGE_GROUPING, { obj });
  }

  async createBadgeType(dto: BadgeType, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(CREATE_BADGE_TYPE, { obj });
  }

  async createBadge(dto: Badge, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(CREATE_BADGE, { obj });
  }
}

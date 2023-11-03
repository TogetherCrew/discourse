import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeTypeDto } from './dto/load-badge-type.dto';

@Injectable()
export class BadgeTypesRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async insertMany(badgeTypes: LoadBadgeTypeDto[], batchSize = 100) {
    console.log('BadgeTypesRepository.insertMany', badgeTypes.length);
    for (let index = 0; index < badgeTypes.length; index += batchSize) {
      const batch = badgeTypes.slice(index, index + batchSize);

      const params = { badgeTypes: batch };

      const cypher = [
        'UNWIND $badgeTypes AS badgeType',
        'MERGE (f:Forum {uuid: badgeType.forumUUID})',
        'CREATE (b:BadgeType) SET b = badgeType',
        // 'MERGE (f)-[:HAS_BADGE_TYPE]->(b)',
      ].join(' ');

      await this.neo4jService.write(cypher, params);
    }
  }
}

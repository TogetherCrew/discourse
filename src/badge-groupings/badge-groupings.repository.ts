import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeGroupingDto } from '../badges/dto/load-badges.dto';

@Injectable()
export class BadgeGroupingsRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async insertMany(badgeGroupings: LoadBadgeGroupingDto[], batchSize = 100) {
    console.log('BadgeGroupingsRepository.insertMany', badgeGroupings.length);
    for (let index = 0; index < badgeGroupings.length; index += batchSize) {
      const batch = badgeGroupings.slice(index, index + batchSize);

      const params = { badgeGroupings: batch };

      const cypher = [
        'UNWIND $badgeGroupings AS badgeGrouping',
        'MERGE (f:Forum {uuid: badgeGrouping.forumUUID})',
        'CREATE (b:BadgeGrouping) SET b = badgeGrouping',
        // 'MERGE (f)-[:HAS_BADGE_GROUPING]->(b)',
      ].join(' ');

      await this.neo4jService.write(cypher, params);
    }
  }
}

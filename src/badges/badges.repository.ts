import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeDto } from './dto/load-badges.dto';

@Injectable()
export class BadgesRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async insertMany(badges: LoadBadgeDto[], batchSize = 100) {
    console.log('BadgesRepository.insertMany', badges.length);
    for (let index = 0; index < badges.length; index += batchSize) {
      const batch = badges.slice(index, index + batchSize);

      const params = { badges: batch };
      // const cypher = 'UNWIND $badges AS badge CREATE (b:Badge) SET b = badge';

      const cypher = [
        'UNWIND $badges AS badge',
        'MERGE (f:Forum {uuid: badge.forumUUID})',
        'CREATE (b:Badge) SET b = badge',
        'MERGE (f)-[:HAS_BADGE]->(b)',
      ].join(' ');

      await this.neo4jService.write(cypher, params);
    }
  }
}

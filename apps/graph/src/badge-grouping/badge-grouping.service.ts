import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class BadgeGroupingService {
  private readonly logger = new Logger(BadgeGroupingService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseBadgeGrouping { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: BadgeGrouping, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`BadgeGrouping ${dto.id} created.`);
  }
}

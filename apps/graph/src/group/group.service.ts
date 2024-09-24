import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseGroup { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj += $obj',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Group, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`Group ${dto.id} created.`);
  }
}

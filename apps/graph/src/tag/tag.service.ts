import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseTag { id: $obj.id, endpoint: $obj.endpoint })',
    'SET obj.text = $obj.text, obj.target_tag = $obj.target_tag',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Tag, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`Tag ${dto.id} created.`);
  }
}

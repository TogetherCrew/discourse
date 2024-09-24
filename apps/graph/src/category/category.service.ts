import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  private readonly CREATE = [
    'MERGE (obj:DiscourseCategory { id: $obj.id, endpoint: $obj.endpoint })',
    'ON CREATE SET',
    'obj.id = $obj.id,',
    'obj.endpoint = $obj.endpoint,',
    'obj.name = $obj.name,',
    'obj.color = $obj.color,',
    'obj.description = $obj.description,',
    'obj.descriptionText = $obj.descriptionText,',
    'obj.parentCategoryId = $obj.parentCategoryId',
    'ON MATCH SET',
    'obj.name = $obj.name,',
    'obj.color = $obj.color,',
    'obj.description = $obj.description,',
    'obj.descriptionText = $obj.descriptionText,',
    'obj.parentCategoryId = $obj.parentCategoryId',
    // 'WITH obj, $obj as data',
    // 'WHERE data.parentCategoryId IS NOT NULL',
    // 'MERGE (p:DiscourseCategory { id: data.parentCategoryId, endpoint: data.endpoint })',
    // 'MERGE (obj)-[:HAS_PARENT]->(p)',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: Category, endpoint): Promise<void> {
    const obj = this.transformService.transform(dto, { endpoint });
    await this.neo4jService.write(this.CREATE, { obj });
    this.logger.log(`Category ${dto.id} created.`);
  }
}

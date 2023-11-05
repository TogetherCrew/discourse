import { Module } from '@nestjs/common';
import { BaseEtlSchemaService } from './base-etl.service';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [DiscourseModule, BaseTransformerModule, Neo4jModule],
  providers: [BaseEtlSchemaService],
  exports: [BaseEtlSchemaService],
})
export class BaseEtlSchemaModule {}

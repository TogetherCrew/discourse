import { Module } from '@nestjs/common';
import { DiscourseModule } from '@app/discourse';
import { BaseTransformerModule } from '../base-transformer/base-transformer.module';
import { Neo4jModule } from 'nest-neo4j/dist';
import { BaseEtlProcessor } from './base-etl.processor';

@Module({
  imports: [DiscourseModule, BaseTransformerModule, Neo4jModule],
  providers: [BaseEtlProcessor],
  exports: [BaseEtlProcessor],
})
export class BaseEtlModule {}

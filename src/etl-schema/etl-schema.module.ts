import { Module } from '@nestjs/common';
import { EtlSchemaService } from './etl-schema.service';

@Module({
  providers: [EtlSchemaService],
  exports: [EtlSchemaService],
})
export class EtlSchemaModule {}

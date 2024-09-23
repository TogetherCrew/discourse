import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { schemaConfig, rmqConfig, neo4jConfig, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransformModule } from './transform/transform.module';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, neo4jConfig],
      isGlobal: true,
    }),
    RmqModule,
    TransformModule,
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
  ],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule { }

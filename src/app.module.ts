import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './config/configs.schema';
import baseConfig from './config/base.config';
import neo4jConfig from './config/neo4j.config';
import { Neo4jModule } from 'nest-neo4j';
import { ForumsModule } from './forums/forums.module';
import { BullModule } from '@nestjs/bullmq';
import { OrchestrationModule } from './orchestration/orchestration.module';
import redisConfig from './config/redis.config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ExtractModule } from './extract/extract.module';
import { TransformModule } from './transform/transform.module';
import proxyConfig from './config/proxy.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
      load: [baseConfig, neo4jConfig, redisConfig, proxyConfig],
    }),
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
    ForumsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    OrchestrationModule,
    ExtractModule,
    TransformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

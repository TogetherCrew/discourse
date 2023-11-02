import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './config/configs.schema';
import baseConfig from './config/base.config';
import neo4jConfig from './config/neo4j.config';
import { Neo4jModule } from 'nest-neo4j';
import { BullModule } from '@nestjs/bullmq';
import { BadgesModule } from './badge/badges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
      load: [baseConfig, neo4jConfig],
    }),
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
    BadgesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import {
  baseConfig,
  proxyConfig,
  redisConfig,
  schemaConfig,
  rmqConfig,
  airflowConfig,
  Services,
  RmqModule,
} from '@app/common';
import { CronModule } from './src/cron/cron.module';
import { AppController } from './app.controller';
import { ExtractorModule } from './src/extractor/extractor.module';
import { AirflowModule } from './src/airflow/airflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      isGlobal: true,
      load: [baseConfig, redisConfig, proxyConfig, rmqConfig, airflowConfig],
    }),
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
    CronModule,
    ExtractorModule,
    AirflowModule,
    RmqModule.register(Services.mongo),
  ],
  controllers: [AppController],
})
export class AppModule { }

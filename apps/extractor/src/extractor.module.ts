import { Module } from '@nestjs/common';
import { ExtractorController } from './extractor.controller';
import { ExtractorService } from './extractor.service';
import { FLOW_PRODUCER, QUEUES } from '@app/discourse/constants';
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
  RmqModule,
  Services,
  airflowConfig,
} from '@app/common';
import { ProcessorsModule } from './processors/processors.modules';
import { DiscourseModule } from '@app/discourse';
import { CommonModule } from './common/common.module';

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
    BullModule.registerFlowProducer({
      name: FLOW_PRODUCER,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    RmqModule.register(Services.mongo),
    ProcessorsModule,
    DiscourseModule,
    CommonModule,
  ],
  controllers: [ExtractorController],
  providers: [ExtractorService],
})
export class ExtractorModule { }

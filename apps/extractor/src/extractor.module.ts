import { Module } from '@nestjs/common';
import { ExtractorController } from './extractor.controller';
import { ExtractorService } from './extractor.service';
import { FLOW_PRODUCER } from '@app/discourse/constants';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import {
  baseConfig,
  proxyConfig,
  redisConfig,
  schemaConfig,
  RmqModule,
  Services,
  rmqConfig,
} from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      isGlobal: true,
      load: [baseConfig, redisConfig, proxyConfig, rmqConfig],
    }),
    RmqModule.register(Services.neo4j),
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
  ],
  controllers: [ExtractorController],
  providers: [ExtractorService],
})
export class ExtractorModule { }

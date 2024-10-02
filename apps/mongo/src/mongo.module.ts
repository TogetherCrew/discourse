import { Module } from '@nestjs/common';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import {
  schemaConfig,
  rmqConfig,
  mongoConfig,
  RmqModule,
  Services,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Platform, PlatformSchema } from './schemas/platform.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, mongoConfig],
      isGlobal: true,
    }),
    RmqModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongoConfig)],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Platform.name, schema: PlatformSchema },
    ]),
    RmqModule.register(Services.mongo),
  ],
  controllers: [MongoController],
  providers: [MongoService],
})
export class MongoModule { }

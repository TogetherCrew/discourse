import { NestFactory } from '@nestjs/core';
import { MongoModule } from './mongo.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(MongoModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.mongo.queue));
  await app.startAllMicroservices();
}
bootstrap();

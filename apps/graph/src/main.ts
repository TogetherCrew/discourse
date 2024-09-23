import { NestFactory } from '@nestjs/core';
import { GraphModule } from './graph.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(GraphModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.graph.queue));
  await app.startAllMicroservices();
}
bootstrap();

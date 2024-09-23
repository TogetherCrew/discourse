import { NestFactory } from '@nestjs/core';
import { ExtractorModule } from './extractor.module';
import { RmqService, Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ExtractorModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.extractor.queue));
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();

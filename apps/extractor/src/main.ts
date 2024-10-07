import { NestFactory } from '@nestjs/core';
import { RmqService, Services } from '@app/common';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // VERSIONING
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Discourse API')
    .setDescription('Documentation of the Discourse API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.extractor.queue));
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { MongoModule } from './mongo.module';

async function bootstrap() {
  const app = await NestFactory.create(MongoModule);
  await app.listen(3000);
}
bootstrap();

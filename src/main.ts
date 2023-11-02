import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('base.port');

  await app.listen(port, () => {
    Logger.verbose(`Server is running on port ${port}`, 'NestApplication');
  });
}
bootstrap();

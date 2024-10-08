import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ExtractDto } from './src/dto/extract.dto';
import { ExtractorService } from './src/extractor/extractor.service';
import { AirflowService } from './src/airflow/airflow.service';
import { Patterns, Services } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlatformDocument } from 'apps/mongo/src/schemas/platform.schema';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly extractorService: ExtractorService,
    private readonly airflowService: AirflowService,
    @Inject(Services.mongo.name) private readonly mongoClient: ClientProxy,
  ) { }

  @Post()
  extract(@Body() dto: ExtractDto): Promise<string> {
    return this.extractorService.extract(
      dto.platform_id,
      dto.from_topic_id,
      dto.from_post_id,
    );
  }

  @Get(':id')
  async run(@Param('id') id: string): Promise<void> {
    const platform: PlatformDocument = await firstValueFrom(
      this.mongoClient.send(Patterns.Mongo.Platform.FindById, { id }),
    );
    return await this.airflowService.dagRuns(platform);
  }
}

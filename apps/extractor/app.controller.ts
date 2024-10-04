import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ExtractDto } from './src/dto/extract.dto';
import { ExtractorService } from './src/extractor/extractor.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: ExtractorService) { }

  @Post()
  extract(@Body() dto: ExtractDto): Promise<string> {
    return this.extractorService.extract(
      dto.platform_id,
      dto.from_topic_id,
      dto.from_post_id,
    );
  }
}

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ExtractDto } from './dto/extract.dto';

@Controller()
export class ExtractorController {
  private readonly logger = new Logger(ExtractorController.name);

  constructor(private readonly extractorService: ExtractorService) { }

  @Post()
  extract(@Body() dto: ExtractDto): Promise<string> {
    return this.extractorService.extract(
      dto.platform_id,
      dto.from_topic_id,
      dto.from_post_id,
    );
  }
}

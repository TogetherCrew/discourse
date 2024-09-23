import { Body, Controller, Post } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ExtractDto } from './dto/extract.dto';

@Controller()
export class ExtractorController {
  constructor(private readonly extractorService: ExtractorService) { }

  @Post()
  extract(@Body() extractDto: ExtractDto): string {
    return this.extractorService.extract(extractDto);
  }
}

import { Injectable } from '@nestjs/common';
import { ExtractDto } from './dto/extract.dto';

@Injectable()
export class ExtractorService {
  extract({ endpoint }: ExtractDto): string {
    return `Hello ${endpoint}!`;
  }
}

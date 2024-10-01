import { Controller, Get } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Controller()
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get()
  getHello(): string {
    return this.mongoService.getHello();
  }
}

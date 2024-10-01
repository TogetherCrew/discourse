import { Module } from '@nestjs/common';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';

@Module({
  imports: [],
  controllers: [MongoController],
  providers: [MongoService],
})
export class MongoModule {}

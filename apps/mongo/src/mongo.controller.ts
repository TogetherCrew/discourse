import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { Platform } from './schemas/platform.schema';

@Controller()
@UseInterceptors(EventsInterceptor)
export class MongoController {
  private readonly logger = new Logger(MongoController.name);

  constructor(private readonly mongoService: MongoService) { }

  // @MessagePattern(Patterns.Mongo.Platform.Extraction.Start)
  // async start(@Payload('endpoint') endpoint: string): Promise<void> {
  //   this.logger.debug(`endpoint: ${endpoint}`);
  //   await this.mongoService.start(endpoint);
  // }

  // @MessagePattern(Patterns.Mongo.Platform.Extraction.Complete)
  // async complete(@Payload('endpoint') endpoint: string): Promise<void> {
  //   this.logger.debug(`endpoint: ${endpoint}`);
  //   await this.mongoService.complete(endpoint);
  // }

  @MessagePattern(Patterns.Mongo.Platform.UpdateOne)
  async updateOne(
    @Payload('filter') filter: any,
    @Payload('update') update: any,
  ): Promise<void> {
    this.logger.debug(`updateOne: ${filter}`);
    await this.mongoService.updateOne(filter, update);
  }

  @MessagePattern(Patterns.Mongo.Platform.FindById)
  async findOne(@Payload('id') id: string): Promise<Platform> {
    const result = await this.mongoService.findById(id);
    return result;
  }
}

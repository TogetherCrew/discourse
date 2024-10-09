import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { Platform } from './schemas/platform.schema';
import { log } from 'console';

@Controller()
@UseInterceptors(EventsInterceptor)
export class MongoController {
  private readonly logger = new Logger(MongoController.name);

  constructor(private readonly mongoService: MongoService) { }

  @MessagePattern(Patterns.Mongo.Platform.UpdateOne)
  async updateOne(
    @Payload('filter') filter: any,
    @Payload('update') update: any,
  ): Promise<void> {
    this.logger.log({ filter });
    this.logger.log({ update });
    await this.mongoService.updateOne(filter, update);
  }

  @MessagePattern(Patterns.Mongo.Platform.FindById)
  async findOne(@Payload('id') id: string): Promise<Platform> {
    this.logger.log({ id });
    return await this.mongoService.findById(id);
  }

  @MessagePattern(Patterns.Mongo.Platform.Find)
  async find(
    @Payload('filter') filter: any,
    @Payload('projection') projection: any,
    @Payload('options') options: any,
  ): Promise<any> {
    this.logger.log({ filter });
    this.logger.log({ projection });
    this.logger.log({ options });
    return await this.mongoService.find(filter, projection, options);
  }
}

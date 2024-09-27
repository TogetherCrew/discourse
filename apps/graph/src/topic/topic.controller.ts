import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/common';
import { TopicService } from './topic.service';

@Controller()
@UseInterceptors(EventsInterceptor)
export class TopicController {
  private readonly logger = new Logger(TopicController.name);

  constructor(private readonly service: TopicService) { }

  @MessagePattern(Patterns.Graph.Topic.Create)
  async create(
    @Payload('topic') topic: Topic,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(topic, endpoint);
  }
}

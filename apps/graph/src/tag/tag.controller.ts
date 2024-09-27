import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagService } from './tag.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly service: TagService) { }

  @MessagePattern(Patterns.Graph.Tag.Create)
  async create(
    @Payload('tag') tag: Tag,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(tag, endpoint);
  }
}

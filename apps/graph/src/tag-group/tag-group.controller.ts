import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TagGroupService } from './tag-group.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class TagGroupController {
  private readonly logger = new Logger(TagGroupController.name);

  constructor(private readonly service: TagGroupService) { }

  @MessagePattern(Patterns.Graph.TagGroup.Create)
  async create(
    @Payload('tag_group') tag_group: TagGroup,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(tag_group, endpoint);
  }
}

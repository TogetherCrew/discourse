import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/common';
import { GroupService } from './group.service';

@Controller()
@UseInterceptors(EventsInterceptor)
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor(private readonly service: GroupService) { }

  @MessagePattern(Patterns.Graph.Group.Create)
  async create(
    @Payload('group') group: Group,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(group, endpoint);
  }
}

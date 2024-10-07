import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserActionService } from './user-action.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class UserActionController {
  private readonly logger = new Logger(UserActionController.name);

  constructor(private readonly service: UserActionService) { }

  @MessagePattern(Patterns.Graph.UserAction.Create)
  async create(
    @Payload('user_action') user_action: UserAction,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(user_action, endpoint);
  }
}

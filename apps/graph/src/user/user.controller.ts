import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly service: UserService) { }

  @MessagePattern(Patterns.Graph.User.Create)
  async create(
    @Payload('user') user: any,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(user, endpoint);
  }

  @MessagePattern(Patterns.Graph.User.GetUniqueUsersByPosts)
  async getUniqueUsersByUsers(
    @Payload('endpoint') endpoint: string,
    @Payload('skip') skip: number,
    @Payload('limit') limit: number,
  ) {
    this.logger.debug(`endpoint: ${endpoint}, skip: ${skip}, limit: ${limit}`);
    return this.service.getUniqueUsersByUsers(endpoint, skip, limit);
  }
}

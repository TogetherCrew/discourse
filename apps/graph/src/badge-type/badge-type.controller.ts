import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeTypeService } from './badge-type.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class BadgeTypeController {
  private readonly logger = new Logger(BadgeTypeController.name);

  constructor(private readonly service: BadgeTypeService) { }

  @MessagePattern(Patterns.Graph.BadgeType.Create)
  async create(
    @Payload('badge_type') badge_type: BadgeType,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(badge_type, endpoint);
  }
}

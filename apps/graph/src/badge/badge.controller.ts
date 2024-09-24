import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeService } from './badge.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class BadgeController {
  private readonly logger = new Logger(BadgeController.name);

  constructor(private readonly service: BadgeService) { }

  @MessagePattern(Patterns.Graph.Badge.Create)
  async create(
    @Payload('badge') badge: Badge,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(badge, endpoint);
  }
}

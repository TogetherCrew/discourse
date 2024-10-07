import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BadgeGroupingService } from './badge-grouping.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class BadgeGroupingController {
  private readonly logger = new Logger(BadgeGroupingController.name);

  constructor(private readonly service: BadgeGroupingService) { }

  @MessagePattern(Patterns.Graph.BadgeGrouping.Create)
  async create(
    @Payload('badge_grouping') badge_grouping: BadgeGrouping,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(badge_grouping, endpoint);
  }
}

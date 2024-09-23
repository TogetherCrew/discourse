import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { GraphService } from './graph.service';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
@UseInterceptors(EventsInterceptor)
export class GraphController {
  private readonly logger = new Logger(GraphController.name);

  constructor(private readonly graphService: GraphService) { }

  // @MessagePattern('createTopic')
  // async createTopic(createTopicDto: Topic): Promise<void> {
  //   this.logger.log(createTopicDto.id);
  // }

  // @MessagePattern('createPost')
  // async createPost(createPostDto: Post): Promise<void> {
  //   this.logger.log(createPostDto.id);
  // }

  @MessagePattern('createBadge')
  async createBadge(
    @Payload('badge') badge: Badge,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.graphService.createBadge(badge, endpoint);
  }

  @MessagePattern('createBadgeGrouping')
  async createBadgeGrouping(
    @Payload('badge_grouping') badge_grouping: BadgeGrouping,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.graphService.createBadgeGrouping(badge_grouping, endpoint);
  }

  @MessagePattern('createBadgeType')
  async createBadgeType(
    @Payload('badge_type') badge_type: BadgeType,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.graphService.createBadgeType(badge_type, endpoint);
  }
}

import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostService } from './post.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(private readonly service: PostService) { }

  @MessagePattern(Patterns.Graph.Post.Create)
  async create(
    @Payload('post') post: Post,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(post, endpoint);
  }

  @MessagePattern(Patterns.Graph.Post.UpdateRepliedTo)
  async updateRepliedTo(@Payload('endpoint') endpoint: string): Promise<void> {
    this.logger.debug(`updateRepliedTo(${endpoint})`);
    return this.service.updateRepliedTo(endpoint);
  }

  @MessagePattern(Patterns.Graph.Post.LatestById)
  async latestById(@Payload('endpoint') endpoint: string): Promise<void> {
    return await this.service.latestById(endpoint);
  }
}

import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { Patterns } from '@app/common';

@Controller()
@UseInterceptors(EventsInterceptor)
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly service: CategoryService) { }

  @MessagePattern(Patterns.Graph.Category.Create)
  async create(
    @Payload('category') category: Category,
    @Payload('endpoint') endpoint: string,
  ): Promise<void> {
    await this.service.create(category, endpoint);
  }
}

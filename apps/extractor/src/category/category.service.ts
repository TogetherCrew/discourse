import { Patterns, Services } from '@app/common';
import { DiscourseService } from '@app/discourse';
import { JOBS } from '@app/discourse/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    @Inject(Services.graph.name) private readonly graphClient: ClientProxy,
  ) { }

  async handleJob(job: Job<any, any, typeof JOBS.CATEGORY>): Promise<any> {
    const { endpoint } = job.data;
    const {
      data: {
        category_list: { categories },
      },
    } = await this.discourseService.getCategories(endpoint);

    for (const category of categories) {
      await this.graphClient.emit(Patterns.Graph.Category.Create, {
        category,
        endpoint,
      });
      if (category.subcategory_list) {
        for (const sub of category.subcategory_list) {
          await this.graphClient.emit(Patterns.Graph.Category.Create, {
            category: sub,
            endpoint,
          });
        }
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Forum } from '../forums/entities/forum.entity';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { Job } from 'bullmq';
import { handleError } from '../errorHandler';

type ExtractDto = {
  forum: Forum;
};

type TransformDto = ExtractDto & {
  categories: Category[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class CategoriesService extends EtlService {
  async extract(job: Job<ExtractDto, any, string>): Promise<any> {
    try {
      const { forum } = job.data;
      const { data } = await this.discourseService.getCategories(
        forum.endpoint,
      );
      const {
        category_list: { categories },
      } = data;

      this.flowProducer.add({
        queueName: QUEUES.TRANSFORM,
        name: JOBS.CATEGORY,
        data: { forum, categories },
      });
    } catch (error) {
      job.log(error.message);
      handleError(error);
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    try {
      const { forum, categories } = job.data;
      const subcategories: Category[] = [];
      const batch = categories.map((category) => {
        if (category.subcategory_list && category.subcategory_list.length > 0) {
          category.subcategory_list.forEach((subcategory) => {
            subcategories.push(subcategory);
          });
        }
        return this.formatCategory(category, forum);
      });

      subcategories.forEach((subcategory) => {
        batch.push(this.formatCategory(subcategory, forum));
      });

      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.CATEGORY,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_CATEGORY, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private formatCategory(category: Category, forum: Forum) {
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      descriptionText: category.description_text,
      forumUuid: forum.uuid,
      parentCategoryId: category.parent_category_id,
    };
  }
}

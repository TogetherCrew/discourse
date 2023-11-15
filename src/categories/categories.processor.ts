import { QUEUES } from '../constants/queues.constants';
import { Processor } from '@nestjs/bullmq';
import { BaseEtlProcessor } from '../base-etl/base-etl.processor';
import { CategoriesService } from './categories.service';

@Processor(QUEUES.CATEGORY)
export class CategoriesProcessor extends BaseEtlProcessor {
  constructor(private readonly categoriesService: CategoriesService) {
    super(categoriesService);
  }
}

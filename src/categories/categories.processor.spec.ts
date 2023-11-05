import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesProcessor } from './categories.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('CategoriesProcessor', () => {
  let processor: CategoriesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesProcessor, BaseEtlSchemaService],
    }).compile();

    processor = module.get<CategoriesProcessor>(CategoriesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

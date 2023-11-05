import { Test, TestingModule } from '@nestjs/testing';
import { TagsProcessor } from './tags.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('BadgeGroupingsService', () => {
  let processor: TagsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsProcessor, BaseEtlSchemaService],
    }).compile();

    processor = module.get<TagsProcessor>(TagsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

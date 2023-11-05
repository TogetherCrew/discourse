import { Test, TestingModule } from '@nestjs/testing';
import { TagGroupsProcessor } from './tag-groups.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('BadgeGroupingsService', () => {
  let processor: TagGroupsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagGroupsProcessor, BaseEtlSchemaService],
    }).compile();

    processor = module.get<TagGroupsProcessor>(TagGroupsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

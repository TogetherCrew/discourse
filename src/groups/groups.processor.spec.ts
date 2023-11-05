import { Test, TestingModule } from '@nestjs/testing';
import { GroupsProcessor } from './groups.processor';
import { BaseEtlSchemaService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('GroupsProcessor', () => {
  let processor: GroupsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsProcessor, BaseEtlSchemaService],
    }).compile();

    processor = module.get<GroupsProcessor>(GroupsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

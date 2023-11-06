import { Test, TestingModule } from '@nestjs/testing';
import { GroupsProcessor } from './groups.processor';
import { GroupsEtlService } from './groups-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('GroupsProcessor', () => {
  let processor: GroupsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsProcessor, GroupsEtlService],
    }).compile();

    processor = module.get<GroupsProcessor>(GroupsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

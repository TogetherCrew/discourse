import { Test, TestingModule } from '@nestjs/testing';
import { BadgesProcessor } from './badges.processor';
import { BaseEtlService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('BadgeGroupingsService', () => {
  let processor: BadgesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgesProcessor, BaseEtlService],
    }).compile();

    processor = module.get<BadgesProcessor>(BadgesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

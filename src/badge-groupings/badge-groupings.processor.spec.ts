import { Test, TestingModule } from '@nestjs/testing';
import { BadgeGroupingsProcessor } from './badge-groupings.processor';
import { BaseEtlService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('BadgeGroupingsService', () => {
  let processor: BadgeGroupingsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeGroupingsProcessor, BaseEtlService],
    }).compile();

    processor = module.get<BadgeGroupingsProcessor>(BadgeGroupingsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

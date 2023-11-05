import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesProcessor } from './badge-types.processor';
import { BaseEtlService } from '../base-etl/base-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('BadgeGroupingsService', () => {
  let processor: BadgeTypesProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeTypesProcessor, BaseEtlService],
    }).compile();

    processor = module.get<BadgeTypesProcessor>(BadgeTypesProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});
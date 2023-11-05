import { Test, TestingModule } from '@nestjs/testing';
import { BadgeGroupingsProcessor } from './badge-groupings.processor';

describe('BadgeTypesService', () => {
  let service: BadgeGroupingsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeGroupingsProcessor],
    }).compile();

    service = module.get<BadgeGroupingsProcessor>(BadgeGroupingsProcessor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesRepository } from './badge-types.repository';

describe('BadgeTypesRepository', () => {
  let service: BadgeTypesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeTypesRepository],
    }).compile();

    service = module.get<BadgeTypesRepository>(BadgeTypesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

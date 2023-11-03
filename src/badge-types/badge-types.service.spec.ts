import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesService } from './badge-types.service';

describe('BadgeTypesService', () => {
  let service: BadgeTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeTypesService],
    }).compile();

    service = module.get<BadgeTypesService>(BadgeTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

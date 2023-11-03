import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesService } from './badge-types.service';
import { BadgeTypesRepository } from './badge-types.repository';
import { LoadBadgeTypeDto } from '../badges/dto/load-badges.dto';

jest.mock('./badge-types.repository');

describe('BadgeTypesService', () => {
  let service: BadgeTypesService;
  let repository: jest.Mocked<BadgeTypesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeTypesService, BadgeTypesRepository],
    }).compile();

    service = module.get<BadgeTypesService>(BadgeTypesService);
    repository = module.get(BadgeTypesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertMany', () => {
    it('should call the repository insertMany method with the provided badges', async () => {
      const mockBadges = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
        // Add more badges as needed
      ] as LoadBadgeTypeDto[];

      await service.insertMany(mockBadges);

      expect(repository.insertMany).toHaveBeenCalledWith(mockBadges);
    });
  });
});

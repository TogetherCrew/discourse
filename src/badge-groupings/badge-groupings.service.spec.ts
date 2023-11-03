import { Test, TestingModule } from '@nestjs/testing';
import { BadgeGroupingsService } from './badge-groupings.service';
import { BadgeGroupingsRepository } from './badge-groupings.repository';
import { LoadBadgeGroupingDto } from './dto/load-badge-grouping.dto';

jest.mock('./badge-groupings.repository');

describe('BadgeTypesService', () => {
  let service: BadgeGroupingsService;
  let repository: jest.Mocked<BadgeGroupingsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeGroupingsService, BadgeGroupingsRepository],
    }).compile();

    service = module.get<BadgeGroupingsService>(BadgeGroupingsService);
    repository = module.get(BadgeGroupingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertMany', () => {
    it('should call the repository insertMany method with the provided badges', async () => {
      const mockBadgeGroupings = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
        // Add more badges as needed
      ] as LoadBadgeGroupingDto[];

      await service.insertMany(mockBadgeGroupings);

      expect(repository.insertMany).toHaveBeenCalledWith(mockBadgeGroupings);
    });
  });
});

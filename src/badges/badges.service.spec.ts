import { Test, TestingModule } from '@nestjs/testing';
import { BadgesService } from './badges.service';
import { BadgesRepository } from './badges.repository';
import { LoadBadgeDto } from './dto/load-badges.dto';

jest.mock('./badges.repository');

describe('BadgesService', () => {
  let service: BadgesService;
  let repository: jest.Mocked<BadgesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgesService, BadgesRepository],
    }).compile();

    service = module.get<BadgesService>(BadgesService);
    repository = module.get(BadgesRepository);
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
      ] as LoadBadgeDto[];

      await service.insertMany(mockBadges);

      expect(repository.insertMany).toHaveBeenCalledWith(mockBadges);
    });
  });
});

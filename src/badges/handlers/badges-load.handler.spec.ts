import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { BadgesService } from '../badges.service';
import { BadgesLoadHandler } from './badges-load.handler';
import { LoadBadgeDto, LoadBadgesDto } from '../dto/load-badges.dto';

describe('BadgesLoadHandler', () => {
  let handler: BadgesLoadHandler;
  let badgeService: Partial<BadgesService>;

  beforeEach(async () => {
    badgeService = {
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesLoadHandler,
        { provide: BadgesService, useValue: badgeService },
      ],
    }).compile();

    handler = module.get<BadgesLoadHandler>(BadgesLoadHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('process', () => {
    it('should call badgeService.insertMany with badges from job data', async () => {
      const mockBadges = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeDto[];

      const mockJob: Partial<Job<LoadBadgesDto, any, string>> = {
        id: '1',
        data: { badges: mockBadges },
      };

      await handler.process(mockJob as Job<LoadBadgesDto, any, string>);

      expect(badgeService.insertMany).toHaveBeenCalledWith(mockBadges);
    });
  });
});

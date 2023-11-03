import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { BadgesService } from '../badges.service';
import { BadgeTypesService } from '../../badge-types/badge-types.service';
import { BadgeGroupingsService } from '../../badge-groupings/badge-groupings.service';
import { BadgesLoadHandler } from './badges-load.handler';
import { LoadBadgesDto } from '../dto/load-badges.dto';
import { LoadBadgeDto } from '../dto/load-badge.dto';
import { LoadBadgeTypeDto } from '../../badge-types/dto/load-badge-type.dto';
import { LoadBadgeGroupingDto } from '../../badge-groupings/dto/load-badge-grouping.dto';

describe('BadgesLoadHandler', () => {
  let handler: BadgesLoadHandler;
  let badgeService: Partial<BadgesService>;
  let badgeTypesService: Partial<BadgeTypesService>;
  let badgeGroupingsService: Partial<BadgeGroupingsService>;

  beforeEach(async () => {
    badgeService = {
      insertMany: jest.fn(),
    };
    badgeTypesService = {
      insertMany: jest.fn(),
    };
    badgeGroupingsService = {
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesLoadHandler,
        { provide: BadgesService, useValue: badgeService },
        { provide: BadgeTypesService, useValue: badgeTypesService },
        { provide: BadgeGroupingsService, useValue: badgeGroupingsService },
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
      const mockBadgeTypes = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeTypeDto[];
      const mockBadgeGroupings = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeGroupingDto[];

      const mockJob: Partial<Job<LoadBadgesDto, any, string>> = {
        id: '1',
        data: {
          badges: mockBadges,
          badgeTypes: mockBadgeTypes,
          badgeGroupings: mockBadgeGroupings,
        },
      };

      await handler.process(mockJob as Job<LoadBadgesDto, any, string>);

      expect(badgeService.insertMany).toHaveBeenCalledWith(mockBadges);
      expect(badgeTypesService.insertMany).toHaveBeenCalledWith(mockBadgeTypes);
      expect(badgeGroupingsService.insertMany).toHaveBeenCalledWith(
        mockBadgeGroupings,
      );
    });
  });
});

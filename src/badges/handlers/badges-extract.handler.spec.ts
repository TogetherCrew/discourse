import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';
import { DiscourseService } from '@app/discourse';
import { BadgesExtractHandler } from './badges-extract.handler';
import { BADGE_QUEUE } from '../../constants/queues.constants';
import { TRANSFORM_JOB } from '../../constants/jobs.contants';
import { AxiosResponse } from 'axios';

const BullQueue_BADGE_QUEUE = `BullQueue_${BADGE_QUEUE}`;

describe('BadgesExtractHandler', () => {
  let handler: BadgesExtractHandler;
  let discourseService: jest.Mocked<DiscourseService>;
  let badgeQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesExtractHandler,
        {
          provide: DiscourseService,
          useValue: {
            getBadges: jest.fn(),
          },
        },
        {
          provide: BullQueue_BADGE_QUEUE,
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<BadgesExtractHandler>(BadgesExtractHandler);
    discourseService = module.get(DiscourseService);
    badgeQueue = module.get(BullQueue_BADGE_QUEUE);
  });

  it('should process job and queue badge transformations', async () => {
    const mockJobData = {
      forum: {
        endpoint: 'testEndpoint',
      },
    };
    const mockBadgeResponse: Partial<AxiosResponse<BadgesResponse, any>> = {
      data: {
        badges: [],
        badge_types: [],
        badge_groupings: [],
      },
    };
    discourseService.getBadges.mockResolvedValue(
      mockBadgeResponse as AxiosResponse<BadgesResponse>,
    );
    const job = { id: '1', data: mockJobData } as any;

    await handler.process(job);

    expect(discourseService.getBadges).toHaveBeenCalledWith(
      mockJobData.forum.endpoint,
    );
    expect(badgeQueue.add).toHaveBeenCalledWith(TRANSFORM_JOB, {
      forum: mockJobData.forum,
      badges: mockBadgeResponse.data.badges,
      badge_types: mockBadgeResponse.data.badge_types,
      badge_groupings: mockBadgeResponse.data.badge_groupings,
    });
  });
});

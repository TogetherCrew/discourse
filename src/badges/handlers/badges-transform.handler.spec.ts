import { Test, TestingModule } from '@nestjs/testing';
import { Job, Queue } from 'bullmq';
import { BADGE_QUEUE } from '../../constants/queues.constants';
import { BadgesTransformHandler } from './badges-transform.handler';
import { TransformersService } from '../../transformers/transformers.service';
import { TransformBadgesDto } from '../dto/transform-badges.dto';
import { LOAD_JOB } from '../../constants/jobs.contants';

const QUEUE = `BullQueue_${BADGE_QUEUE}`;
describe('BadgesTransformHandler', () => {
  let handler: BadgesTransformHandler;
  let transformersService: TransformersService;
  let queue: Queue;

  beforeEach(async () => {
    const mockTransformersService = {
      transform: jest.fn().mockImplementation((obj, { forumUUID }) => ({
        ...obj,
        forumUUID,
      })),
    };
    const mockQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesTransformHandler,
        {
          provide: TransformersService,
          useValue: mockTransformersService,
        },
        {
          provide: QUEUE,
          useValue: mockQueue,
        },
      ],
    }).compile();

    handler = module.get<BadgesTransformHandler>(BadgesTransformHandler);
    transformersService = module.get<TransformersService>(TransformersService);
    queue = module.get<Queue>(QUEUE);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(transformersService).toBeDefined();
    expect(queue).toBeDefined();
  });

  describe('process', () => {
    it('should transform badges, badge_types, and badge_groupings and add them to the queue', async () => {
      const jobData: TransformBadgesDto = {
        forum: { uuid: 'forum-uuid' },
        badges: [{ id: 1 }, { id: 2 }] as Badge[],
        badge_types: [{ id: 1 }] as BadgeType[],
        badge_groupings: [{ id: 1 }] as BadgeGrouping[],
      };
      const mockJob: Partial<Job<TransformBadgesDto, any, string>> = {
        id: '1',
        data: jobData,
      };

      await handler.process(mockJob as Job<TransformBadgesDto, any, string>);

      expect(transformersService.transform).toHaveBeenCalledTimes(
        jobData.badges.length +
          jobData.badge_types.length +
          jobData.badge_groupings.length,
      );
      expect(queue.add).toHaveBeenCalledWith(LOAD_JOB, {
        badges: expect.any(Array),
        badgeTypes: expect.any(Array),
        badgeGroupings: expect.any(Array),
      });

      // Additional checks can be made to ensure that the transformation is correct
      expect(queue.add).toHaveBeenCalledWith(LOAD_JOB, {
        badges: [
          { id: 1, forumUUID: 'forum-uuid' },
          { id: 2, forumUUID: 'forum-uuid' },
        ],
        badgeTypes: [{ id: 1, forumUUID: 'forum-uuid' }],
        badgeGroupings: [{ id: 1, forumUUID: 'forum-uuid' }],
      });
    });
  });
});

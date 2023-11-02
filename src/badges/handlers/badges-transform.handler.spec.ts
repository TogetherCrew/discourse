import { Test, TestingModule } from '@nestjs/testing';
import { BadgesTransformHandler } from './badges-transform.handler';
import { BadgesTransformer } from '../badges.transformer';
import { Queue } from 'bullmq';
import { BADGE_QUEUE } from 'src/constants/queues.constants';
import { LOAD_JOB } from 'src/constants/jobs.contants';

const BullQueue_BADGE_QUEUE = `BullQueue_${BADGE_QUEUE}`;
describe('BadgesTransformHandler', () => {
  let handler: BadgesTransformHandler;
  let mockQueue: Partial<Queue>;
  let mockTransformer: Partial<BadgesTransformer>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    };

    mockTransformer = {
      transform: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesTransformHandler,
        { provide: 'BadgesTransformer', useValue: mockTransformer },
        { provide: BullQueue_BADGE_QUEUE, useValue: mockQueue },
      ],
    }).compile();

    handler = module.get<BadgesTransformHandler>(BadgesTransformHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('process', () => {
    it('should transform badges and add them to the queue', async () => {
      const mockJob = {
        id: 'test-job-id',
        data: {
          forum: { id: 1, name: 'test-forum' },
          badges: [{ id: 1, name: 'test-badge' }],
        },
      };

      await handler.process(mockJob as any);

      expect(mockTransformer.transform).toHaveBeenCalledWith(
        mockJob.data.badges[0],
        mockJob.data.forum,
      );
      expect(mockQueue.add).toHaveBeenCalledWith(LOAD_JOB, {
        badges: [
          {
            ...mockJob.data.badges[0],
            forum: mockJob.data.forum,
          },
        ],
      });
    });
  });
});

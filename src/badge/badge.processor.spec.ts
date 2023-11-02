import { Test, TestingModule } from '@nestjs/testing';
import { BadgeExtractHandler } from './handlers/badge-extract.handler';
import { BadgeLoadHandler } from './handlers/badge-load.handler';
import { BadgeTransformHandler } from './handlers/badge-transform.handler';
import { Job } from 'bullmq';
import {
  EXTRACT_JOB,
  LOAD_JOB,
  TRANSFORM_JOB,
} from 'src/constants/jobs.contants';
import { BadgeProcessor } from './badge.processor';

describe('BadgeProcessor', () => {
  let processor: BadgeProcessor;
  let extractHandler: jest.Mocked<BadgeExtractHandler>;
  let transformHandler: jest.Mocked<BadgeTransformHandler>;
  let loadHandler: jest.Mocked<BadgeLoadHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeProcessor,
        {
          provide: BadgeExtractHandler,
          useValue: {
            process: jest.fn(),
          },
        },
        {
          provide: BadgeTransformHandler,
          useValue: {
            process: jest.fn(),
          },
        },
        {
          provide: BadgeLoadHandler,
          useValue: {
            process: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<BadgeProcessor>(BadgeProcessor);
    extractHandler = module.get(BadgeExtractHandler);
    transformHandler = module.get(BadgeTransformHandler);
    loadHandler = module.get(BadgeLoadHandler);
  });

  it('should process EXTRACT_JOB', async () => {
    const job = { name: EXTRACT_JOB } as Job<any, any, string>;
    await processor.process(job);
    expect(extractHandler.process).toHaveBeenCalledWith(job);
  });

  it('should process TRANSFORM_JOB', async () => {
    const job = { name: TRANSFORM_JOB } as Job<any, any, string>;
    await processor.process(job);
    expect(transformHandler.process).toHaveBeenCalledWith(job);
  });

  it('should process LOAD_JOB', async () => {
    const job = { name: LOAD_JOB } as Job<any, any, string>;
    await processor.process(job);
    expect(loadHandler.process).toHaveBeenCalledWith(job);
  });

  it('should not process unknown jobs', async () => {
    const job = { name: 'UNKNOWN_JOB' } as Job<any, any, string>;
    await processor.process(job);
    expect(extractHandler.process).not.toHaveBeenCalled();
    expect(transformHandler.process).not.toHaveBeenCalled();
    expect(loadHandler.process).not.toHaveBeenCalled();
  });
});

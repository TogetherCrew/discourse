import { Test, TestingModule } from '@nestjs/testing';
import { BadgesExtractHandler } from './handlers/badges-extract.handler';
import { BadgesLoadHandler } from './handlers/badges-load.handler';
import { BadgesTransformHandler } from './handlers/badges-transform.handler';
import { Job } from 'bullmq';
import {
  EXTRACT_JOB,
  LOAD_JOB,
  TRANSFORM_JOB,
} from '../constants/jobs.contants';
import { BadgesProcessor } from './badges.processor';

describe('BadgesProcessor', () => {
  let processor: BadgesProcessor;
  let extractHandler: jest.Mocked<BadgesExtractHandler>;
  let transformHandler: jest.Mocked<BadgesTransformHandler>;
  let loadHandler: jest.Mocked<BadgesLoadHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesProcessor,
        {
          provide: BadgesExtractHandler,
          useValue: {
            process: jest.fn(),
          },
        },
        {
          provide: BadgesTransformHandler,
          useValue: {
            process: jest.fn(),
          },
        },
        {
          provide: BadgesLoadHandler,
          useValue: {
            process: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<BadgesProcessor>(BadgesProcessor);
    extractHandler = module.get(BadgesExtractHandler);
    transformHandler = module.get(BadgesTransformHandler);
    loadHandler = module.get(BadgesLoadHandler);
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

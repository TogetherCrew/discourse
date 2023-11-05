import { Test, TestingModule } from '@nestjs/testing';
import { TopicsProcessor } from './topics.processor';
import { TopicsEtlService } from './topics-etl.service';

jest.mock('../base-etl/base-etl.service');

describe('TopicsProcessor', () => {
  let processor: TopicsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsProcessor, TopicsEtlService],
    }).compile();

    processor = module.get<TopicsProcessor>(TopicsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});

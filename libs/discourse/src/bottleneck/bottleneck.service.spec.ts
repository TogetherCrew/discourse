import { Test, TestingModule } from '@nestjs/testing';
import { BottleneckService } from './bottleneck.service';

describe('BottleneckService', () => {
  let service: BottleneckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BottleneckService],
    }).compile();

    service = module.get<BottleneckService>(BottleneckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

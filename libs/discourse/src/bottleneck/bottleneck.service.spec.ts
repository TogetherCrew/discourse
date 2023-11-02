import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import Bottleneck from 'bottleneck';
import { BottleneckService } from './bottleneck.service';

jest.mock('bottleneck');

describe('BottleneckService', () => {
  let service: BottleneckService;
  let mockConfigService: jest.Mocked<Partial<ConfigService>>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REDIS_HOST') return '127.0.0.1';
      if (key === 'REDIS_PORT') return 6379;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BottleneckService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<BottleneckService>(BottleneckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a new limiter', () => {
    const limiter = new Bottleneck();
    service.setLimiter('testKey', limiter);
    expect(service.getLimiter('testKey')).toBe(limiter);
  });

  it('should delete and disconnect a limiter', () => {
    const limiter = new Bottleneck();
    limiter.disconnect = jest.fn();
    service.setLimiter('testKey', limiter);
    service.deleteLimiter('testKey');
    expect(service.getLimiter('testKey')).toBeUndefined();
    expect(limiter.disconnect).toHaveBeenCalled();
  });

  it('should create a cluster limiter with correct options', () => {
    const options = { someOption: 'someValue' };
    service.createClusterLimiter('testKey', options);
    expect(Bottleneck).toHaveBeenCalledWith({
      datastore: 'ioredis',
      clearDatastore: false,
      clientOptions: {
        host: '127.0.0.1',
        port: 6379,
      },
      ...options,
      id: 'testKey',
    });
  });
});

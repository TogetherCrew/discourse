import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bottleneck from 'bottleneck';

@Injectable()
export class BottleneckService {
  private readonly limiters: Map<string, Bottleneck> = new Map();
  private defaultOptions: Bottleneck.ConstructorOptions;

  constructor(private configService: ConfigService) {
    this.defaultOptions = {
      datastore: 'ioredis',
      clearDatastore: false,
      clientOptions: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
      minTime: (60 * 1000) / 200,
      reservoir: 20,
      reservoirRefreshAmount: 20,
      reservoirRefreshInterval: 60 * 1000,
      maxConcurrent: 5,
    };
  }

  setLimiter(key: string, limiter: Bottleneck) {
    this.limiters.set(key, limiter);
  }

  deleteLimiter(key: string): boolean {
    const limiter = this.getLimiter(key);
    if (limiter) {
      limiter.disconnect();
    }
    return this.limiters.delete(key);
  }

  getLimiter(key: string): Bottleneck | undefined {
    return this.limiters.get(key);
  }

  createClusterLimiter(key: string, options: any): Bottleneck {
    const limiter: Bottleneck = new Bottleneck({
      ...this.defaultOptions,
      ...options,
      id: key,
    });

    return limiter;
  }
}

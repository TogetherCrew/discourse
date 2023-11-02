import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';

@Injectable()
export class BottleneckService {
  private readonly limiters: Map<string, Bottleneck> = new Map();

  setLimiter(key: string, limiter: Bottleneck) {
    this.limiters.set(key, limiter);
  }

  deleteLimiter(key: string): boolean {
    return this.limiters.delete(key);
  }

  getLimiter(key: string) {
    return this.limiters.get(key);
  }
}

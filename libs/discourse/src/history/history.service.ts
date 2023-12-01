import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

type HistoryStore = {
  timestamp: number;
  code: number;
};

@Injectable()
export class HistoryService {
  redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis(configService.get('redis'));
  }

  async set(url: string, code: number = 0) {
    await this.redis.hset(`history:${url}`, {
      timestamp: new Date().getTime().toString(),
      code: code.toString(),
    });
  }
  async get(url: string): Promise<HistoryStore> {
    try {
      const result = await this.redis.hgetall(`history:${url}`);
      if (Object.keys(result).length == 0) {
        throw new Error('Empty object');
      } else {
        return {
          timestamp: Number(result.timestamp),
          code: Number(result.code),
        };
      }
    } catch (error) {
      return {
        timestamp: 0,
        code: 0,
      };
    }
  }
  async valid(url: string, ms: number = 1000 * 60 * 60 * 23): Promise<boolean> {
    const prev = await this.get(url);
    if (prev.timestamp == 0) {
      return false;
    } else if (prev.code == 404) {
      return true;
    } else if (prev.timestamp + ms < new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  }
}

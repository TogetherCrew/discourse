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
    // console.log(`SET(${url})`);
    await this.redis.hset(`history:${url}`, {
      ts: new Date().getTime().toString(),
      code: code.toString(),
    });
  }
  async get(url: string): Promise<HistoryStore> {
    const result = await this.redis.hgetall(`history:${url}`);
    return {
      timestamp: Number(result.timestamp),
      code: Number(result.code),
    };
  }
  async valid(url: string, ms: number = 1000 * 60 * 60 * 24): Promise<boolean> {
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

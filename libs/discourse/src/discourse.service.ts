import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { lastValueFrom } from 'rxjs';
import { BottleneckService } from './bottleneck/bottleneck.service';

@Injectable()
export class DiscourseService {
  constructor(
    private httpService: HttpService,
    private bottleneckService: BottleneckService,
  ) {}

  private async get(endpoint: string, path: string, scheme = 'https') {
    try {
      const limiter: Bottleneck = this.getLimiter(endpoint);
      const url = `${scheme}://${endpoint}${path}`;
      return limiter.schedule(() => lastValueFrom(this.httpService.get(url)));
    } catch (error) {
      throw error;
    }
  }

  async getBadges(endpoint: string): Promise<AxiosResponse<BadgesResponse>> {
    const path = '/badges.json';
    return this.get(endpoint, path);
  }

  private getLimiter(id: string, options = null): Bottleneck {
    let limiter: Bottleneck = this.bottleneckService.getLimiter(id);
    if (!limiter) {
      limiter = this.bottleneckService.createClusterLimiter(id, options);
      this.bottleneckService.setLimiter(id, limiter);
    }
    return limiter;
  }
}

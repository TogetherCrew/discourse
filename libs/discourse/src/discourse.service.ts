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

  async getBadges(endpoint: string): Promise<AxiosResponse<BadgesResponse>> {
    const path = '/badges.json';
    return this.get(endpoint, path);
  }

  async getCategories(
    endpoint: string,
  ): Promise<AxiosResponse<CategoriesResponse>> {
    const path = '/categories.json';
    return this.get(endpoint, path);
  }

  async getTagGroups(
    endpoint: string,
  ): Promise<AxiosResponse<TagGroupsResponse>> {
    const path = '/tag_groups.json';
    return this.get(endpoint, path);
  }

  async getTags(endpoint: string): Promise<AxiosResponse<TagsResponse>> {
    const path = '/tags.json';
    return this.get(endpoint, path);
  }

  async getGroups(
    endpoint: string,
    page = 0,
  ): Promise<AxiosResponse<GroupsResponse | GroupsResponse[]>> {
    const path = `/groups.json?page=${page}`;
    return this.get(endpoint, path);
  }

  private async get(endpoint: string, path: string, scheme = 'https') {
    try {
      const limiter: Bottleneck = this.getLimiter(endpoint);
      const url = `${scheme}://${endpoint}${path}`;
      return limiter.schedule(() => lastValueFrom(this.httpService.get(url)));
    } catch (error) {
      throw error;
    }
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

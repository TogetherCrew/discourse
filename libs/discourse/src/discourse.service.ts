import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
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
  ): Promise<AxiosResponse<GroupsResponse>> {
    const path = `/groups.json?page=${page}`;
    return this.get(endpoint, path);
  }

  async getLatestTopics(
    endpoint: string,
    page = 0,
    order:
      | 'default'
      | 'created'
      | 'activity'
      | 'views'
      | 'posts'
      | 'category'
      | 'likes'
      | 'op_likes'
      | 'posters' = 'default',
  ): Promise<AxiosResponse<TopicsResponse>> {
    const path = `/latest.json?order=${order}&page=${page}`;
    return this.get(endpoint, path);
  }

  async getPosts(
    endpoint: string,
    topicId: number,
  ): Promise<AxiosResponse<PostsResponse>> {
    const path = `/t/${topicId}/posts.json`;
    return this.get(endpoint, path);
  }

  async getUser(
    endpoint: string,
    username: string,
  ): Promise<AxiosResponse<UserResponse>> {
    const path = `/u/${username}.json`;
    return this.get(endpoint, path);
  }

  private async get(endpoint: string, path: string, scheme = 'https') {
    const limiter: Bottleneck = this.getLimiter(endpoint);
    const url = `${scheme}://${endpoint}${path}`;
    return limiter.schedule(() => this.req(url));
  }

  private async req(url: string): Promise<AxiosResponse<any, any>> {
    try {
      const obs = this.httpService.get(url);
      return await lastValueFrom(obs);
    } catch (error) {
      const err: AxiosError = error as AxiosError;
      console.error(err.message, err.code);
      console.log(err.response.config.url);
    }
  }

  private getLimiter(
    id: string,
    options?: Partial<Bottleneck.ConstructorOptions>,
  ): Bottleneck {
    let limiter: Bottleneck = this.bottleneckService.getLimiter(id);
    if (limiter == undefined) {
      limiter = this.bottleneckService.createClusterLimiter(id, options);
      limiter.on('depleted', () => {
        console.log('limiter.counts', limiter.counts());
      });
      this.bottleneckService.setLimiter(id, limiter);
    }
    return limiter;
  }
}

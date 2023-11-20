import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { BottleneckService } from './bottleneck/bottleneck.service';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ConfigService } from '@nestjs/config';
import { defaultOpts, proxyOpts } from './bottleneck/options.constants';

@Injectable()
export class DiscourseService {
  proxyAgent: HttpsProxyAgent<string>;

  constructor(
    private bottleneckService: BottleneckService,
    private readonly configService: ConfigService,
  ) {
    const uri = configService.get<string>('PROXY_URI');
    if (uri) {
      this.proxyAgent = new HttpsProxyAgent(uri);
      this.proxyAgent.keepAlive = true;
    }
  }

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

  async getGroupMembers(
    endpoint: string,
    groupName: string,
    offset = 0,
    limit = 50,
  ): Promise<AxiosResponse<GroupMembersResponse>> {
    const path = `/groups/${groupName}/members.json?limit=${limit}&offset=${offset}`;
    return this.get(endpoint, path);
  }

  async getUserActions(
    endpoint: string,
    username: string,
    offset = 0,
    limit = 50,
  ): Promise<AxiosResponse<UserActionsResponse>> {
    const path = `/user_actions.json?username=${username}&limit=${limit}&offset=${offset}`;
    return this.get(endpoint, path);
  }

  getUserBadges(
    endpoint: string,
    username: string,
  ): Promise<AxiosResponse<UserBadgesResponse>> {
    const path = `/user-badges/${username}.json`;
    return this.get(endpoint, path);
  }

  private async get(endpoint: string, path: string, scheme = 'https') {
    const url = `${scheme}://${endpoint}${path}`;
    if (this.proxyAgent) {
      const limiter: Bottleneck = this.getLimiter(endpoint, proxyOpts);
      return limiter.schedule(() =>
        this.req(url, { httpsAgent: this.proxyAgent }),
      );
    } else {
      const limiter: Bottleneck = this.getLimiter(endpoint, defaultOpts);
      return limiter.schedule(() => this.req(url));
    }
  }

  private req(url: string, opts = {}): Promise<AxiosResponse<any, any>> {
    try {
      return axios.get(url, opts);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      throw error;
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

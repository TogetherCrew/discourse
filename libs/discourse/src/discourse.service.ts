import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { BottleneckService } from './bottleneck/bottleneck.service';
import { defaultOpts, proxyOpts } from './bottleneck/options.constants';
import { ProxyService } from './proxy/proxy.service';
import { HistoryService } from './history/history.service';

@Injectable()
export class DiscourseService {
  constructor(
    private bottleneckService: BottleneckService,
    private proxyService: ProxyService,
    private historyService: HistoryService,
  ) {}

  async getBadges(endpoint: string): Promise<AxiosResponse<BadgesResponse>> {
    const path = '/badges.json';
    return this.get(endpoint, path);
  }

  async getCategories(
    endpoint: string,
  ): Promise<AxiosResponse<CategoriesResponse>> {
    const path = '/categories.json?include_subcategories=true';
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

  async getTopic(
    endpoint: string,
    topicId: number,
  ): Promise<AxiosResponse<Topic>> {
    const path = `/t/${topicId}.json`;
    return this.get(endpoint, path);
  }

  async getPost(
    endpoint: string,
    postId: number,
  ): Promise<AxiosResponse<Post>> {
    const path = `/posts/${postId}.json`;
    return this.get(endpoint, path);
  }

  async getPosts(
    endpoint: string,
    topicId: number,
    page: number = 1,
  ): Promise<AxiosResponse<PostsResponse>> {
    const path = `/t/${topicId}.json?page=${page}`;
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
    filters: number[] = [1],
    actingUsername?: string,
  ): Promise<AxiosResponse<UserActionsResponse>> {
    const path = [
      `/user_actions.json?`,
      `username=${username}`,
      `&limit=${limit}`,
      `&offset=${offset}`,
      `&filter=${filters.join(',')}`,
      `&action_username=${actingUsername}`,
    ].join('');
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
    const valid = await this.historyService.valid(url);
    if (!valid) {
      await this.historyService.set(url);
      const limiter: Bottleneck = this.getLimiter(endpoint, proxyOpts);
      return limiter.schedule(() =>
        this.req(url, { httpsAgent: this.proxyService.getProxy() }),
      );
    } else {
      throw new Error('Duplicate request');
    }
  }

  private async req(url: string, opts = {}): Promise<AxiosResponse<any, any>> {
    try {
      console.log(url);
      return axios.get(url, opts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        await this.historyService.set(url, error.response.status);
      }
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

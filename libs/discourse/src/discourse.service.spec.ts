import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from './discourse.service';
import { BottleneckService } from './bottleneck/bottleneck.service';
import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('DiscourseService', () => {
  let service: DiscourseService;

  let mockBottleneckService: any;

  beforeEach(async () => {
    mockBottleneckService = {
      getLimiter: jest.fn(),
      createClusterLimiter: jest.fn(),
      setLimiter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscourseService,
        {
          provide: BottleneckService,
          useValue: mockBottleneckService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<DiscourseService>(DiscourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBadges', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<BadgesResponse>> = {
        data: { badges: [] },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getBadges(endpoint);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/badges.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCategories', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<CategoriesResponse>> = {
        data: {
          category_list: {
            categories: [],
            can_create_category: false,
            can_create_topic: false,
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getCategories(endpoint);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/categories.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTagGroups', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<TagGroupsResponse>> = {
        data: {
          tag_groups: [],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getTagGroups(endpoint);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/tag_groups.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTags', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<TagsResponse>> = {
        data: {
          tags: [],
          extras: {
            tag_groups: [],
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getTags(endpoint);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/tags.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getGroups', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<GroupsResponse>> = {
        data: {
          groups: [],
          extras: {
            type_filters: [],
          },
          total_rows_groups: 0,
          load_more_groups: '',
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getGroups(endpoint);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/groups.json?page=0',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLatestTopics', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<TopicsResponse>> = {
        data: {
          users: [],
          primary_groups: [],
          topic_list: {
            can_create_topic: false,
            draft: '',
            draft_key: '',
            draft_sequence: 0,
            per_page: 0,
            more_topics_url: '',
            topics: [],
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getLatestTopics(endpoint, 0, 'created');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/latest.json?order=created&page=0',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPosts', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<PostsResponse>> = {
        data: {
          post_stream: {
            posts: [],
          },
          id: 0,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getPosts(endpoint, 0);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/t/0/posts.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUser', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<UserResponse>> = {
        data: {
          user_badges: [],
          badges: [],
          badge_types: [],
          users: [],
          user: {
            active: false,
            admin: false,
            moderator: false,
            last_seen_at: '',
            last_emailed_at: '',
            created_at: '',
            last_seen_age: 0,
            last_emailed_age: 0,
            created_at_age: 0,
            manual_locked_trust_level: '',
            title: '',
            time_read: 0,
            staged: false,
            days_visited: 0,
            posts_read_count: 0,
            topics_entered: 0,
            post_count: 0,
            associated_accounts: [],
            can_send_activation_email: false,
            can_activate: false,
            can_deactivate: false,
            ip_address: '',
            registration_ip_address: '',
            can_grant_admin: false,
            can_revoke_admin: false,
            can_grant_moderation: false,
            can_revoke_moderation: false,
            can_impersonate: false,
            like_count: 0,
            like_given_count: 0,
            topic_count: 0,
            flags_given_count: 0,
            flags_received_count: 0,
            private_topics_count: 0,
            can_delete_all_posts: false,
            can_be_deleted: false,
            can_be_anonymized: false,
            can_be_merged: false,
            full_suspend_reason: '',
            silence_reason: '',
            post_edits_count: 0,
            primary_group_id: '',
            badge_count: 0,
            warnings_received_count: 0,
            bounce_score: 0,
            reset_bounce_score_after: '',
            can_view_action_logs: false,
            can_disable_second_factor: false,
            can_delete_sso_record: false,
            api_key_count: 0,
            single_sign_on_record: '',
            approved_by: undefined,
            suspended_by: '',
            silenced_by: '',
            penalty_counts: undefined,
            next_penalty: '',
            tl3_requirements: undefined,
            groups: [],
            external_ids: undefined,
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getUser(endpoint, 'test-username');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/u/test-username.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getGroupMembers', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<GroupMembersResponse>> = {
        data: {
          members: [],
          owners: [],
          meta: {
            total: 0,
            limit: 0,
            offset: 0,
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getGroupMembers(endpoint, 'group');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/groups/group/members.json?limit=50&offset=0',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserActions', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<UserActionsResponse>> = {
        data: {
          user_actions: [],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getUserActions(endpoint, 'username');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/user_actions.json?username=username&limit=50&offset=0',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserBadges', () => {
    let mockLimiter: Bottleneck;

    beforeEach(() => {
      mockLimiter = new Bottleneck();
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);
    });

    it('should call the correct URL', async () => {
      const endpoint = 'test.endpoint';
      const mockResponse: Partial<AxiosResponse<UserBadgesResponse>> = {
        data: {
          user_badges: [],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getUserBadges(endpoint, 'username');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test.endpoint/user-badges/username.json',
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLimiter', () => {
    it('should return existing limiter if it exists', () => {
      const mockLimiter = {};
      const id = 'test.id';
      mockBottleneckService.getLimiter.mockReturnValueOnce(mockLimiter);

      const limiter = service['getLimiter'](id);

      expect(mockBottleneckService.getLimiter).toHaveBeenCalledWith(id);
      expect(limiter).toBe(mockLimiter);
    });

    it('should create a new limiter if it does not exist', () => {
      const id = 'test.id';
      const mockLimiter = { id, on: jest.fn() };
      mockBottleneckService.getLimiter.mockReturnValueOnce(null);
      mockBottleneckService.createClusterLimiter.mockReturnValueOnce(
        mockLimiter,
      );

      const limiter = service['getLimiter'](id);

      expect(mockBottleneckService.createClusterLimiter).toHaveBeenCalledWith(
        id,
        undefined,
      );
      expect(mockBottleneckService.setLimiter).toHaveBeenCalledWith(
        id,
        mockLimiter,
      );
      expect(limiter).toBe(mockLimiter);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DiscourseService } from './discourse.service';
import { HttpService } from '@nestjs/axios';
import { BottleneckService } from './bottleneck/bottleneck.service';
import { EMPTY, of } from 'rxjs';
import { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';

describe('DiscourseService', () => {
  let service: DiscourseService;

  const mockHttpService = {
    get: jest.fn(),
    permissions$: EMPTY,
  };

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
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: BottleneckService,
          useValue: mockBottleneckService,
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getBadges(endpoint);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/badges.json',
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getCategories(endpoint);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/categories.json',
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getTagGroups(endpoint);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/tag_groups.json',
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
            categories: [],
          },
        },
      };
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getTags(endpoint);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/tags.json',
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getGroups(endpoint);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/groups.json?page=0',
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getLatestTopics(endpoint, 0, 'created');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/latest.json?order=created&page=0',
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
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getPosts(endpoint, 0);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://test.endpoint/t/0/posts.json',
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
      const mockLimiter = { id };
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

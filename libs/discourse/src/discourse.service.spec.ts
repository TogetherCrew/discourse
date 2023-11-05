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

  const mockBottleneckService = {
    getLimiter: jest.fn(),
    createClusterLimiter: jest.fn(),
    setLimiter: jest.fn(),
  };

  beforeEach(async () => {
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
          categories: [],
          can_create_category: false,
          can_create_topic: false,
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
      const mockLimiter = {};
      const id = 'test.id';
      mockBottleneckService.getLimiter.mockReturnValueOnce(null);
      mockBottleneckService.createClusterLimiter.mockReturnValueOnce(
        mockLimiter,
      );

      const limiter = service['getLimiter'](id);

      expect(mockBottleneckService.createClusterLimiter).toHaveBeenCalledWith(
        id,
        null,
      );
      expect(mockBottleneckService.setLimiter).toHaveBeenCalledWith(
        id,
        mockLimiter,
      );
      expect(limiter).toBe(mockLimiter);
    });
  });
});

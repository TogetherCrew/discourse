import { Test, TestingModule } from '@nestjs/testing';
import { Job, Queue } from 'bullmq';
import { CategoriesService } from '../categories/categories.service';
import { GroupMembersService } from '../groups-members/group-members.service';
import { GroupsService } from '../groups/groups.service';
import { PostsService } from '../posts/posts.service';
import { TagsService } from '../tags/tags.service';
import { TopicsService } from '../topics/topics.service';
import { UserActionsService } from '../user-actions/user-actions.service';
import { UserBadgesService } from '../user-badges/user-badges.service';
import { BadgesService } from '../badges/badges.service';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { ExtractProcessor } from './extract.processor';

describe('ExtractProcessor', () => {
  let processor: ExtractProcessor;
  let mockBadgesService: jest.Mocked<BadgesService>;
  let mockGroupsService: jest.Mocked<GroupsService>;
  let mockGroupMembersService: jest.Mocked<GroupMembersService>;
  let mockPostsService: jest.Mocked<PostsService>;
  let mockTagsService: jest.Mocked<TagsService>;
  let mockTopicsService: jest.Mocked<TopicsService>;
  let mockCategoriesService: jest.Mocked<CategoriesService>;
  let mockUserActionsService: jest.Mocked<UserActionsService>;
  let mockUserBadgesService: jest.Mocked<UserBadgesService>;

  beforeEach(async () => {
    mockBadgesService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<BadgesService>;
    mockGroupsService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<GroupsService>;
    mockGroupMembersService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<GroupMembersService>;
    mockPostsService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<PostsService>;
    mockTagsService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<TagsService>;
    mockTopicsService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<TopicsService>;
    mockCategoriesService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<CategoriesService>;
    mockUserActionsService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<UserActionsService>;
    mockUserBadgesService = {
      extract: jest.fn(),
    } as unknown as jest.Mocked<UserBadgesService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtractProcessor,
        {
          provide: BadgesService,
          useValue: mockBadgesService,
        },
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
        {
          provide: GroupMembersService,
          useValue: mockGroupMembersService,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
        {
          provide: TopicsService,
          useValue: mockTopicsService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: UserActionsService,
          useValue: mockUserActionsService,
        },
        {
          provide: UserBadgesService,
          useValue: mockUserBadgesService,
        },
        // Provide other services...
      ],
    }).compile();

    processor = module.get<ExtractProcessor>(ExtractProcessor);
  });

  it('should call the correct service based on job name', async () => {
    const mockBadgesJob = {
      name: JOBS.BADGE,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockGroupsJob = {
      name: JOBS.GROUP,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockGroupMembersJob = {
      name: JOBS.GROUP_MEMBER,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockPostsJob = { name: JOBS.POST, queueName: QUEUES.EXTRACT } as Job;
    const mockTagsJob = { name: JOBS.TAG, queueName: QUEUES.EXTRACT } as Job;
    const mockTopicsJob = {
      name: JOBS.TOPIC,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockCategoriesJob = {
      name: JOBS.CATEGORY,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockUserActionsJob = {
      name: JOBS.USER_ACTION,
      queueName: QUEUES.EXTRACT,
    } as Job;
    const mockUserBadgesJob = {
      name: JOBS.USER_BADGE,
      queueName: QUEUES.EXTRACT,
    } as Job;

    await processor.process(mockBadgesJob as any);
    expect(mockBadgesService.extract).toHaveBeenCalledWith(mockBadgesJob);

    await processor.process(mockGroupsJob as any);
    expect(mockGroupsService.extract).toHaveBeenCalledWith(mockGroupsJob);

    await processor.process(mockGroupMembersJob as any);
    expect(mockGroupMembersService.extract).toHaveBeenCalledWith(
      mockGroupMembersJob,
    );

    await processor.process(mockPostsJob as any);
    expect(mockPostsService.extract).toHaveBeenCalledWith(mockPostsJob);

    await processor.process(mockTagsJob as any);
    expect(mockTagsService.extract).toHaveBeenCalledWith(mockTagsJob);

    await processor.process(mockTopicsJob as any);
    expect(mockTopicsService.extract).toHaveBeenCalledWith(mockTopicsJob);

    await processor.process(mockCategoriesJob as any);
    expect(mockCategoriesService.extract).toHaveBeenCalledWith(
      mockCategoriesJob,
    );

    await processor.process(mockUserActionsJob as any);
    expect(mockUserActionsService.extract).toHaveBeenCalledWith(
      mockUserActionsJob,
    );

    await processor.process(mockUserBadgesJob as any);
    expect(mockUserBadgesService.extract).toHaveBeenCalledWith(
      mockUserBadgesJob,
    );
  });
});

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
import { LoadProcessor } from './load.processor';
import { BadgeGroupingsService } from '../badge-groupings/badge-groupings.service';
import { BadgeTypesService } from '../badge-types/badge-types.service';
import { GroupOwnersService } from '../groups-owners/group-owners.service';
import { TagGroupsService } from '../tag-groups/tag-groups.service';
import { TopicTagsService } from '../topic-tags/topic-tags.service';
import { UsersService } from '../users/users.service';

describe('LoadProcessor', () => {
  let processor: LoadProcessor;
  let mockQueue: jest.Mocked<Queue>;
  let mockBadgeGroupingsService: jest.Mocked<BadgeGroupingsService>;
  let mockBadgeTypesService: jest.Mocked<BadgeTypesService>;
  let mockBadgesService: jest.Mocked<BadgesService>;
  let mockCategoriesService: jest.Mocked<CategoriesService>;

  let mockGroupsService: jest.Mocked<GroupsService>;
  let mockGroupMembersService: jest.Mocked<GroupMembersService>;
  let mockGroupOwnersService: jest.Mocked<GroupOwnersService>;
  let mockPostsService: jest.Mocked<PostsService>;

  let mockTagGroupsService: jest.Mocked<TagGroupsService>;
  let mockTagsService: jest.Mocked<TagsService>;
  let mockTopicTagsService: jest.Mocked<TopicTagsService>;
  let mockTopicsService: jest.Mocked<TopicsService>;
  let mockUserActionsService: jest.Mocked<UserActionsService>;
  let mockUserBadgesService: jest.Mocked<UserBadgesService>;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockQueue = {} as unknown as jest.Mocked<Queue>;
    mockBadgeGroupingsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<BadgeGroupingsService>;
    mockBadgeTypesService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<BadgeTypesService>;
    mockBadgesService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<BadgesService>;
    mockCategoriesService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<CategoriesService>;
    mockGroupsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<GroupsService>;
    mockGroupMembersService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<GroupMembersService>;
    mockGroupOwnersService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<GroupOwnersService>;
    mockPostsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<PostsService>;
    mockTagGroupsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<TagGroupsService>;
    mockTagsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<TagsService>;
    mockTopicTagsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<TopicTagsService>;
    mockTopicsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<TopicsService>;
    mockUserActionsService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<UserActionsService>;
    mockUserBadgesService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<UserBadgesService>;
    mockUsersService = {
      load: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoadProcessor,
        {
          provide: BadgeGroupingsService,
          useValue: mockBadgeGroupingsService,
        },
        {
          provide: BadgeTypesService,
          useValue: mockBadgeTypesService,
        },
        {
          provide: BadgesService,
          useValue: mockBadgesService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
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
          provide: GroupOwnersService,
          useValue: mockGroupOwnersService,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: TagGroupsService,
          useValue: mockTagGroupsService,
        },
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
        {
          provide: TopicTagsService,
          useValue: mockTopicTagsService,
        },
        {
          provide: TopicsService,
          useValue: mockTopicsService,
        },
        {
          provide: UserActionsService,
          useValue: mockUserActionsService,
        },
        {
          provide: UserBadgesService,
          useValue: mockUserBadgesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        // Provide other services...
        {
          provide: `BullQueue_TRANSFORM`,
          useValue: mockQueue,
        },
      ],
    }).compile();

    processor = module.get<LoadProcessor>(LoadProcessor);
  });

  it('should call the correct service based on job name', async () => {
    const mockBadgeGroupingsJob = {
      name: JOBS.BADGE_GROUPING,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockBadgeTypesJob = {
      name: JOBS.BADGE_TYPE,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockBadgesJob = {
      name: JOBS.BADGE,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockCategoriesJob = {
      name: JOBS.CATEGORY,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockGroupsJob = {
      name: JOBS.GROUP,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockGroupMembersJob = {
      name: JOBS.GROUP_MEMBER,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockGroupOwnersJob = {
      name: JOBS.GROUP_OWNER,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockPostsJob = {
      name: JOBS.POST,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockTagGroupsJob = {
      name: JOBS.TAG_GROUP,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockTagsJob = { name: JOBS.TAG, queueName: QUEUES.TRANSFORM } as Job;
    const mockTopicTagsJob = {
      name: JOBS.TOPIC_TAG,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockTopicsJob = {
      name: JOBS.TOPIC,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockUserActionsJob = {
      name: JOBS.USER_ACTION,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockUserBadgesJob = {
      name: JOBS.USER_BADGE,
      queueName: QUEUES.TRANSFORM,
    } as Job;
    const mockUsersJob = {
      name: JOBS.USER,
      queueName: QUEUES.TRANSFORM,
    } as Job;

    await processor.process(mockBadgeGroupingsJob as any);
    expect(mockBadgeGroupingsService.load).toHaveBeenCalledWith(
      mockBadgeGroupingsJob,
    );

    await processor.process(mockBadgeTypesJob as any);
    expect(mockBadgeTypesService.load).toHaveBeenCalledWith(mockBadgeTypesJob);

    await processor.process(mockBadgesJob as any);
    expect(mockBadgesService.load).toHaveBeenCalledWith(mockBadgesJob);

    await processor.process(mockCategoriesJob as any);
    expect(mockCategoriesService.load).toHaveBeenCalledWith(mockCategoriesJob);

    await processor.process(mockGroupsJob as any);
    expect(mockGroupsService.load).toHaveBeenCalledWith(mockGroupsJob);

    await processor.process(mockGroupMembersJob as any);
    expect(mockGroupMembersService.load).toHaveBeenCalledWith(
      mockGroupMembersJob,
    );

    await processor.process(mockGroupOwnersJob as any);
    expect(mockGroupOwnersService.load).toHaveBeenCalledWith(
      mockGroupOwnersJob,
    );

    await processor.process(mockPostsJob as any);
    expect(mockPostsService.load).toHaveBeenCalledWith(mockPostsJob);

    await processor.process(mockTagGroupsJob as any);
    expect(mockTagGroupsService.load).toHaveBeenCalledWith(mockTagGroupsJob);

    await processor.process(mockTagsJob as any);
    expect(mockTagsService.load).toHaveBeenCalledWith(mockTagsJob);

    await processor.process(mockTopicTagsJob as any);
    expect(mockTopicTagsService.load).toHaveBeenCalledWith(mockTopicTagsJob);

    await processor.process(mockTopicsJob as any);
    expect(mockTopicsService.load).toHaveBeenCalledWith(mockTopicsJob);

    await processor.process(mockUserActionsJob as any);
    expect(mockUserActionsService.load).toHaveBeenCalledWith(
      mockUserActionsJob,
    );

    await processor.process(mockUserBadgesJob as any);
    expect(mockUserBadgesService.load).toHaveBeenCalledWith(mockUserBadgesJob);

    await processor.process(mockUsersJob as any);
    expect(mockUsersService.load).toHaveBeenCalledWith(mockUsersJob);
  });
});

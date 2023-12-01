import { TestingModule, Test } from '@nestjs/testing';
import { FlowProducer } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';
import { DiscourseService } from '@app/discourse';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockDiscourseService: jest.Mocked<DiscourseService>;
  let mockNeo4jService: jest.Mocked<Neo4jService>;
  let mockFlowProducer: jest.Mocked<FlowProducer>;

  beforeEach(async () => {
    mockNeo4jService = {
      write: jest.fn(),
    } as unknown as jest.Mocked<Neo4jService>;
    mockFlowProducer = {
      add: jest.fn(),
      addBulk: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        BaseTransformerService,
        {
          provide: DiscourseService,
          useValue: mockDiscourseService,
        },
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
        {
          provide: `BullFlowProducer_${FLOW_PRODUCER}`,
          useValue: mockFlowProducer,
        },
        {
          provide: `BullQueue_EXTRACT`,
          useValue: {
            getJobs: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('transform method', () => {
    it('should process data and add a job to the flowProducer', async () => {
      const date = new Date();
      const forum = { uuid: 'test-uuid' };
      const mockJob = {
        data: {
          forum,
          data: {
            user: {
              id: 1,
              username: 'username',
              name: 'name',
              title: 'title',
              trust_level: 1,
              moderator: true,
              admin: true,
              created_at: date,
              avatar_template: 'avatar_template',
              invited_by: { id: -1 },
              locale: 'en',
            },
            user_badges: [
              {
                id: 1,
                granted_at: date,
                created_at: date,
                badge_id: 1,
                user_id: 1,
                granted_by_id: -1,
              },
            ],
            badges: [
              {
                id: 1,
                name: 'badge',
                description: 'description',
                long_description: 'long_description',
                icon: 'icon',
                badge_grouping_id: 1,
                badge_type_id: 1,
                image_url: 'image_url',
              },
            ],
            badge_types: [
              {
                id: 1,
                name: 'name',
              },
            ],
          },
        },
        log: jest.fn(),
      };

      await service.transform(mockJob as any);

      const user = {
        id: 1,
        username: 'username',
        name: 'name',
        title: 'title',
        trustLevel: 1,
        moderator: true,
        admin: true,
        createdAt: date,
        avatarTemplate: 'avatar_template',
        invitedById: -1,
        locale: 'en',
        forumUuid: forum.uuid,
      };
      const userBadges = [
        {
          id: 1,
          grantedAt: date,
          createdAt: date,
          badgeId: 1,
          userId: 1,
          grantedById: -1,
          forumUuid: forum.uuid,
        },
      ];
      const badges = [
        {
          id: 1,
          name: 'badge',
          description: 'description',
          longDescription: 'long_description',
          icon: 'icon',
          badgeGroupingId: 1,
          badgeTypeId: 1,
          imageUrl: 'image_url',
          forumUuid: forum.uuid,
        },
      ];
      const badgeTypes = [
        {
          id: 1,
          name: 'name',
          forumUuid: forum.uuid,
        },
      ];

      expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
        {
          queueName: QUEUES.LOAD,
          name: JOBS.USER,
          data: {
            user,
            userBadges,
            badges,
            badgeTypes,
          },
        },
        {
          queueName: QUEUES.EXTRACT,
          name: JOBS.USER_ACTION,
          data: {
            username: user.username,
            forum,
          },
        },
      ]);
    });
  });

  describe('load method', () => {
    it('should call neo4jService.write with correct parameters', async () => {
      const mockJob = {
        data: {
          badgeTypes: [],
          badges: [],
          userBadges: [],
          user: {},
        },
      };
      await service.load(mockJob as any);
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.BULK_CREATE_BADGE_TYPE,
        mockJob.data,
      );
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.BULK_CREATE_BADGE,
        mockJob.data,
      );
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.CREATE_USER,
        mockJob.data,
      );
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.BULK_CREATE_USER_BADGES,
        mockJob.data,
      );
    });
  });
});

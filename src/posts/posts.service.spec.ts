import { TestingModule, Test } from '@nestjs/testing';
import { FlowProducer } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';
import { DiscourseService } from '@app/discourse';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
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
        PostsService,
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
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('transform method', () => {
    it('should process data and add a job to the flowProducer', async () => {
      const d = new Date();
      const forum = { uuid: 'test-uuid' };
      const username = 'username';
      const mockJob = {
        data: {
          forum,
          data: {
            id: 1,
            topic_id: 1,
            user_id: 1,
            username,
            user_deleted: false,
            created_at: d,
            updated_at: d,
            deleted_at: d,
            post_type: 1,
            post_number: 1,
            reply_to_post_number: 1,
            hidden: false,
            cooked: 'cooked',
            raw: 'raw',
            score: 1000,
          },
        },
        log: jest.fn(),
      };

      await service.transform(mockJob as any);

      expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
        {
          queueName: QUEUES.LOAD,
          name: JOBS.POST,
          data: {
            post: {
              id: 1,
              topicId: 1,
              userId: 1,
              username,
              userDeleted: false,
              createdAt: d,
              updatedAt: d,
              deletedAt: d,
              postType: 1,
              postNumber: 1,
              replyToPostNumber: 1,
              hidden: false,
              cooked: 'cooked',
              raw: 'raw',
              score: 1000,
              forumUuid: forum.uuid,
            },
          },
        },
        {
          name: JOBS.USER,
          queueName: QUEUES.EXTRACT,
          data: { forum, username },
          opts: { priority: 8 },
        },
      ]);
    });
  });

  describe('load method', () => {
    it('should call neo4jService.write with correct parameters', async () => {
      const mockJob = {
        data: {
          post: {},
        },
      };
      await service.load(mockJob as any);
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.CREATE_POST,
        mockJob.data,
      );
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.CREATE_POST_USER,
        mockJob.data,
      );
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.CREATE_REPLIED_TO_EDGE,
        mockJob.data,
      );
    });
  });
});

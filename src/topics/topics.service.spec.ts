import { TestingModule, Test } from '@nestjs/testing';
import { FlowProducer } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { CYPHERS } from '../constants/cyphers.constants';
import { DiscourseService } from '@app/discourse';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { TopicsService } from './topics.service';

describe('TopicsService', () => {
  let service: TopicsService;
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
        TopicsService,
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

    service = module.get<TopicsService>(TopicsService);
  });

  describe('transform method', () => {
    it('should process data and add a job to the flowProducer', async () => {
      const d = new Date();
      const mockJob = {
        data: {
          forum: { uuid: 'test-uuid' },
          data: {
            id: 1,
            title: 'title',
            fancy_title: 'fancy_title',
            created_at: d,
            deleted_at: d,
            image_url: 'image_url',
            category_id: 1,
            visible: true,
            closed: false,
            archived: false,
            tags: ['tag'],
            post_stream: {
              stream: [1],
            },
          },
        },
        log: jest.fn(),
      };

      await service.transform(mockJob as any);

      const topic = {
        id: 1,
        title: 'title',
        fancyTitle: 'fancy_title',
        createdAt: d,
        deletedAt: d,
        imageUrl: 'image_url',
        categoryId: 1,
        visible: true,
        closed: false,
        archived: false,
        forumUuid: 'test-uuid',
      };

      expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
        {
          name: JOBS.TOPIC,
          queueName: QUEUES.LOAD,
          data: { topic, tagIds: ['tag'] },
        },
        {
          data: {
            forum: {
              uuid: 'test-uuid',
            },
            postId: 1,
          },
          name: JOBS.POST,
          opts: {
            priority: 9,
          },
          queueName: QUEUES.EXTRACT,
        },
      ]);
    });
  });

  describe('load method', () => {
    it('should call neo4jService.write with correct parameters', async () => {
      const mockJob = {
        data: {
          topic: {}, // Replace with actual mock data
        },
      };
      await service.load(mockJob as any);
      expect(mockNeo4jService.write).toHaveBeenCalledWith(
        CYPHERS.CREATE_TOPIC,
        mockJob.data,
      );
    });
  });
});

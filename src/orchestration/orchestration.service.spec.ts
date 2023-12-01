import { FlowProducer } from 'bullmq';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { OrchestrationService } from './orchestration.service';
import { DiscourseService } from '@app/discourse';
import { AxiosResponse } from 'axios';

describe('OrchestrationService', () => {
  let orchestrationService: OrchestrationService;
  let mockFlowProducer: jest.Mocked<FlowProducer>;
  let mockDiscourseService: jest.Mocked<DiscourseService>;

  beforeEach(async () => {
    mockFlowProducer = {
      addBulk: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;
    mockDiscourseService = {
      getLatestTopics: jest.fn(),
    } as unknown as jest.Mocked<DiscourseService>;
    orchestrationService = new OrchestrationService(
      mockFlowProducer,
      mockDiscourseService,
    );
  });

  it('should add jobs correctly when run is called', async () => {
    const forum: Forum = { endpoint: 'example.com', uuid: 'test-uuid' };

    const topics = [{ id: 1 }, { id: 2 }] as Topic[];

    mockDiscourseService.getLatestTopics.mockResolvedValueOnce({
      data: {
        topic_list: {
          topics,
          can_create_topic: false,
          draft_key: '',
          draft_sequence: 0,
          per_page: 0,
        },
        users: [],
        primary_groups: [],
      },
    } as AxiosResponse<TopicsResponse>);

    await orchestrationService.run(forum);

    expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.TOPIC,
        data: { forum, topicId: 1 },
        opts: { priority: 10 },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.TOPIC,
        data: { forum, topicId: 2 },
        opts: { priority: 10 },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.CATEGORY,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.BADGE,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.TAG,
        data: { forum },
      },
      {
        queueName: QUEUES.EXTRACT,
        name: JOBS.GROUP,
        data: { forum },
      },
    ]);
  });
});

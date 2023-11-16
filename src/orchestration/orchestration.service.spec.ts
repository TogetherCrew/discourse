import { FlowProducer } from 'bullmq';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { Forum } from '../forums/entities/forum.entity';
import { OrchestrationService } from './orchestration.service';

describe('OrchestrationService', () => {
  let orchestrationService: OrchestrationService;
  let mockFlowProducer: jest.Mocked<FlowProducer>;

  beforeEach(async () => {
    mockFlowProducer = {
      addBulk: jest.fn(),
    } as unknown as jest.Mocked<FlowProducer>;
    orchestrationService = new OrchestrationService(mockFlowProducer);
  });

  it('should add jobs correctly when run is called', async () => {
    const forum = new Forum(); // Assuming you have a Forum class
    await orchestrationService.run(forum);

    expect(mockFlowProducer.addBulk).toHaveBeenCalledWith([
      expect.objectContaining({
        queueName: QUEUES.EXTRACT,
        name: JOBS.TOPIC,
        data: { forum },
      }),
      expect.objectContaining({
        queueName: QUEUES.EXTRACT,
        name: JOBS.CATEGORY,
        data: { forum },
      }),
      expect.objectContaining({
        queueName: QUEUES.EXTRACT,
        name: JOBS.BADGE,
        data: { forum },
      }),
      expect.objectContaining({
        queueName: QUEUES.EXTRACT,
        name: JOBS.TAG,
        data: { forum },
      }),
      expect.objectContaining({
        queueName: QUEUES.EXTRACT,
        name: JOBS.GROUP,
        data: { forum },
      }),
    ]);
  });
});

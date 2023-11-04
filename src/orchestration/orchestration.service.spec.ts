import { Test } from '@nestjs/testing';
import { FLOWS } from '../constants/flows.constants';
import { EtlService } from '../etl/etl.service';
import { OrchestrationService } from './orchestration.service';
import { Forum } from '../forums/entities/forum.entity';
import { FlowProducer } from 'bullmq';

describe('OrchestrationService', () => {
  let orchestrationService: OrchestrationService;
  let etlService: EtlService;
  let flowProducer: FlowProducer;
  let forum: Forum;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrchestrationService,
        {
          provide: EtlService,
          useValue: {
            etl: jest.fn(),
          },
        },
        {
          provide: `BullFlowProducer_${FLOWS.DISCOURSE_ETL}`,
          useValue: {
            add: jest.fn().mockResolvedValue({ id: 'flowJobId' }),
          },
        },
      ],
    }).compile();

    orchestrationService =
      moduleRef.get<OrchestrationService>(OrchestrationService);
    etlService = moduleRef.get<EtlService>(EtlService);
    flowProducer = moduleRef.get(`BullFlowProducer_${FLOWS.DISCOURSE_ETL}`);
    forum = new Forum(); // mock or use a real Forum instance as required
  });

  it('should be defined', () => {
    expect(orchestrationService).toBeDefined();
  });

  describe('run method', () => {
    it('should create a flow job tree and add it using FlowProducer', async () => {
      const result = await orchestrationService.run(forum);

      expect(etlService.etl).toHaveBeenCalledTimes(10);

      expect(result).toHaveProperty('id', 'flowJobId');
      expect(flowProducer.add).toHaveBeenCalled();
    });
  });
});

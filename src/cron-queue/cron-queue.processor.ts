import {
  InjectFlowProducer,
  InjectQueue,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { FlowProducer, Queue } from 'bullmq';
import { Neo4jService } from 'nest-neo4j';
import { QUEUES } from '../constants/queues.constants';
import { CYPHERS } from '../constants/cyphers.constants';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Forum } from '../forums/entities/forum.entity';
import { OrchestrationService } from '../orchestration/orchestration.service';

@Processor(QUEUES.CRON, {
  removeOnComplete: { age: 60 * 60 * 24 * 1 },
  removeOnFail: { age: 60 * 60 * 24 * 7 },
})
export class CronQueueProcessor extends WorkerHost {
  constructor(
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOW_PRODUCER)
    protected readonly flowProducer: FlowProducer,
    @InjectQueue(QUEUES.CRON) cronQueue: Queue,
    protected readonly orchestractionService: OrchestrationService,
  ) {
    super();
    cronQueue.add('ETL', {}, { repeat: { every: 1000 * 60 * 60 * 4 } });
  }

  async process(): Promise<any> {
    console.log('Starting cron job...');
    const { records } = await this.neo4jService.read(CYPHERS.GET_ALL_FORUMS);
    records.forEach(async (record) => {
      const f = record.toObject()['f'];
      const forum = new Forum();
      forum.endpoint = f.properties.endpoint;
      forum.uuid = f.properties.uuid;
      await this.orchestractionService.run(forum);
    });
  }
}

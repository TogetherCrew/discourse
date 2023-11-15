import { DiscourseService } from '@app/discourse';
import { FlowProducer, Job } from 'bullmq';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FLOW_PRODUCER } from 'src/constants/flows.constants';

export abstract class EtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOW_PRODUCER)
    protected readonly flowProducer: FlowProducer,
  ) {}

  extract?(job: Job);
  abstract transform(job: Job);
  abstract load(job: Job);
}

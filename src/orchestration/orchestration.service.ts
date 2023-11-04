import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowJob, FlowProducer } from 'bullmq';
import { FLOWS } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { EtlService } from '../etl/etl.service';
import { Forum } from '../forums/entities/forum.entity';

@Injectable()
export class OrchestrationService {
  constructor(
    @InjectFlowProducer(FLOWS.DISCOURSE_ETL)
    private readonly flowProducer: FlowProducer,
    private readonly etlService: EtlService,
  ) {}

  async run(forum: Forum) {
    const flow = this.createTree(forum);
    console.log(JSON.stringify(flow));
    const job = await this.flowProducer.add(flow);
    return job;
  }

  private createTree(forum: Forum): FlowJob {
    const badgeGroup = this.etlService.etl(QUEUES.BADGE_GROUPING, { forum });
    const badgeType = this.etlService.etl(QUEUES.BADGE_TYPE, { forum });
    const badge = this.etlService.etl(QUEUES.BADGE, { forum }, [
      badgeGroup,
      badgeType,
    ]);

    const tagGroup = this.etlService.etl(QUEUES.TAG_GROUP, { forum });
    const tag = this.etlService.etl(QUEUES.TAG, { forum }, [tagGroup]);

    const group = this.etlService.etl(QUEUES.GROUP, { forum });
    const category = this.etlService.etl(QUEUES.CATEGORY, { forum }, [group]);

    const topic = this.etlService.etl(QUEUES.TOPIC, { forum }, [tag, category]);
    const post = this.etlService.etl(QUEUES.POST, { forum }, [topic]);

    const user = this.etlService.etl(QUEUES.USER, { forum }, [badge, post]);

    return user;
  }
}

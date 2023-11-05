import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowJob, FlowProducer } from 'bullmq';
import { FLOWS } from '../constants/flows.constants';
import { QUEUES } from '../constants/queues.constants';
import { EtlSchemaService } from '../etl-schema/etl-schema.service';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';

@Injectable()
export class OrchestrationService {
  constructor(
    @InjectFlowProducer(FLOWS.DISCOURSE_ETL)
    private readonly flowProducer: FlowProducer,
    private readonly etlService: EtlSchemaService,
  ) {}

  async run(forum: Forum) {
    const flow = this.createTree(forum);
    console.log(JSON.stringify(flow));
    const job = await this.flowProducer.add(flow);
    return job;
  }

  private createTree(forum: Forum): FlowJob {
    const badgeGroup = this.etlService.etl(QUEUES.BADGE_GROUPING, {
      forum,
      operation: 'getBadges',
      property: 'badge_groupings',
      cypher: CYPHERS.BULK_CREATE_BADGE_GROUPING,
    });
    const badgeType = this.etlService.etl(QUEUES.BADGE_TYPE, {
      forum,
      operation: 'getBadges',
      property: 'badge_types',
      cypher: CYPHERS.BULK_CREATE_BADGE_TYPE,
    });
    const badge = this.etlService.etl(
      QUEUES.BADGE,
      {
        forum,
        operation: 'getBadges',
        property: 'badges',
        cypher: CYPHERS.BULK_CREATE_BADGE,
      },
      [badgeGroup, badgeType],
    );

    const tagGroup = this.etlService.etl(QUEUES.TAG_GROUP, {
      forum,
      operation: 'getTagGroups',
      property: 'tag_groups',
      cypher: CYPHERS.BULK_CREATE_TAG_GROUP,
    });
    // const tag = this.etlService.etl(QUEUES.TAG, { forum }, [tagGroup]);

    // const group = this.etlService.etl(QUEUES.GROUP, { forum });
    // const category = this.etlService.etl(QUEUES.CATEGORY, { forum }, [group]);

    // const topic = this.etlService.etl(QUEUES.TOPIC, { forum }, [tag, category]);
    // const post = this.etlService.etl(QUEUES.POST, { forum }, [topic]);

    const user = this.etlService.etl(
      QUEUES.USER,
      { forum, operation: 'getUsers', property: 'users', cypher: '' },
      [badge /*, post */],
    );

    return user;
  }
}

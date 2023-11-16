import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';

type TransformDto = UserActionsExtractDto & {
  user_actions: UserAction[];
};

type LoadDto = {
  batch: any[];
};

@Injectable()
export class UserActionsService extends EtlService {
  async extract(job: Job<UserActionsExtractDto, any, string>): Promise<any> {
    const { forum, user } = job.data;
    try {
      return this.iterate(job, forum, user);
    } catch (error) {
      job.log(error.log);
    }
  }

  async transform(job: Job<TransformDto, any, string>) {
    try {
      const { forum, user_actions } = job.data;
      const batch = user_actions.map((obj) =>
        this.baseTransformerService.transform(obj, { forum_uuid: forum.uuid }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.USER_ACTIONS,
        name: JOBS.LOAD,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>) {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_ACTION, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async iterate(
    job: Job<UserActionsExtractDto, any, string>,
    forum: Forum,
    user: GroupMember | BasicUser,
    offset = 0,
    limit = 50,
  ) {
    const { data } = await this.discourseService.getUserActions(
      forum.endpoint,
      user.username,
      offset,
      limit,
    );
    const { user_actions }: UserActionsResponse = data;

    if (user_actions.length == 0) {
      return;
    } else {
      await this.flowProducer.add({
        queueName: QUEUES.USER_ACTIONS,
        name: JOBS.TRANSFORM,
        data: { forum, user_actions },
      });
      return await this.iterate(job, forum, user, offset + limit, limit);
    }
  }
}

import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EtlService } from '../etl/etl.service';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { Forum } from '../forums/entities/forum.entity';
import { CYPHERS } from '../constants/cyphers.constants';
import { AxiosError } from 'axios';

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
      throw error;
    }
  }

  async transform(job: Job<TransformDto, any, string>) {
    try {
      const { forum, user_actions } = job.data;
      const batch = user_actions.map((obj) =>
        this.baseTransformerService.transform(obj, {
          forum_uuid: forum.uuid,
        }),
      );
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.USER_ACTION,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>) {
    // console.log(job.data);
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
  ): Promise<void> {
    const user_actions = await this.getUserActions(
      forum.endpoint,
      user.username,
      offset,
      limit,
    );
    if (user_actions.length > 0) {
      await this.flowProducer.add({
        queueName: QUEUES.TRANSFORM,
        name: JOBS.USER_ACTION,
        data: { forum, user_actions },
      });
      await this.iterate(job, forum, user, offset + limit, limit);
    }
  }

  private async getUserActions(
    endpoint: string,
    username: string,
    offset: number,
    limit: number,
  ): Promise<UserAction[]> {
    try {
      const { data } = await this.discourseService.getUserActions(
        endpoint,
        username,
        offset,
        limit,
        [1],
        username,
      );
      const { user_actions } = data;
      return user_actions;
    } catch (error) {
      const err = error as AxiosError;
      switch (err.response.status) {
        case 404:
          return [];
        default:
          throw error;
      }
    }
  }
}

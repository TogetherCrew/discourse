import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { Job } from 'bullmq';
import { Forum } from '../forums/entities/forum.entity';

type TransformDto = {
  forum: Forum;
  user_badges: UserBadge[];
  user: GroupMember | BasicUser;
};

@Injectable()
export class UserBadgesService extends EtlService {
  async extract(job: Job<UserBadgesExtractDto, any, string>): Promise<any> {
    try {
      const { forum, user } = job.data;
      const user_badges = await this.getUserBadges(
        forum.endpoint,
        user.username,
      );

      if (user_badges.length > 0) {
        await this.flowProducer.add({
          queueName: QUEUES.TRANSFORM,
          name: JOBS.USER_BADGE,
          data: { forum, user_badges, user },
        });
      }
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    try {
      const { forum, user_badges, user } = job.data;
      const batch = user_badges.map((user_badge) => {
        const obj = this.baseTransformerService.transform(user_badge, {
          forum_uuid: forum.uuid,
          user_id: user.id,
        });
        return obj;
      });
      await this.flowProducer.add({
        queueName: QUEUES.LOAD,
        name: JOBS.USER_BADGE,
        data: { batch },
      });
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_USER_BADGE, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  private async getUserBadges(endpoint: string, username: string) {
    const response = await this.discourseService.getUserBadges(
      endpoint,
      username,
    );
    switch (response.status) {
      case 200:
        const { user_badges } = response.data;
        return user_badges;
      case 404:
        return [];
      default:
        throw new Error(response.statusText);
    }
  }
}

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

      const { data } = await this.discourseService.getUserBadges(
        forum.endpoint,
        user.username,
      );
      const { user_badges } = data;
      await this.flowProducer.add({
        queueName: QUEUES.USER_BADGES,
        name: JOBS.TRANSFORM,
        data: { forum, user_badges, user },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    const { forum, user_badges, user } = job.data;
    const batch = user_badges.map((user_badge) => {
      const obj = this.baseTransformerService.transform(user_badge, {
        forum_uuid: forum.uuid,
        user_id: user.id,
      });
      return obj;
    });
    await this.flowProducer.add({
      queueName: QUEUES.USER_BADGES,
      name: JOBS.LOAD,
      data: { batch },
    });
  }

  async load(job: Job<any, any, string>): Promise<any> {
    try {
      await this.neo4jService.write(CYPHERS.BULK_CREATE_USER_BADGE, job.data);
    } catch (error) {
      console.error(error.message);
    }
  }
}
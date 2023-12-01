import { Injectable } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { JOBS } from '../constants/jobs.contants';
import { CYPHERS } from '../constants/cyphers.constants';
import { EtlService } from '../etl/etl.service';
import { FlowProducer, Job } from 'bullmq';
import { DiscourseService } from '@app/discourse';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { Neo4jService } from 'nest-neo4j';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { Forum } from '../forums/entities/forum.entity';
import { handleError } from '../errorHandler';

type ExtractDto = {
  forum: Forum;
  username: string;
};
type TransformDto = {
  forum: Forum;
  data: UserResponse;
};
type UserDto = {
  id: number;
  username: string;
  createdAt: Date;
  name: string;
  title?: string;
  trustLevel: number;
  moderator: boolean;
  admin: boolean;
  avatarTemplate: string;
  invitedById?: number;
  locale?: string;
  forumUuid: string;
};
type LoadDto = {
  user: UserDto;
  userBadges: any[];
  badges: any[];
  badgeTypes: any[];
};

@Injectable()
export class UsersService extends EtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
    @InjectFlowProducer(FLOW_PRODUCER)
    protected readonly flowProducer: FlowProducer,
  ) {
    super(discourseService, baseTransformerService, neo4jService, flowProducer);
  }

  async extract(job: Job<ExtractDto, any, string>) {
    try {
      const { forum, username } = job.data;
      const { data } = await this.discourseService.getUser(
        forum.endpoint,
        username,
      );
      await this.flowProducer.add({
        name: JOBS.USER,
        queueName: QUEUES.TRANSFORM,
        data: { forum, data },
      });
    } catch (error) {
      job.log(error.message);
      handleError(error);
    }
  }

  async transform(job: Job<TransformDto, any, string>): Promise<any> {
    try {
      const { forum, data } = job.data;
      const user: UserDto = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        title: data.user.title,
        trustLevel: data.user.trust_level,
        moderator: data.user.moderator,
        admin: data.user.admin,
        createdAt: data.user.created_at,
        avatarTemplate: data.user.avatar_template,
        invitedById: data.user.invited_by?.id,
        locale: data.user.locale,
        forumUuid: forum.uuid,
      };
      const userBadges = data.user_badges?.map((user_badge) => ({
        id: user_badge.id,
        grantedAt: user_badge.granted_at,
        createdAt: user_badge.created_at,
        badgeId: user_badge.badge_id,
        userId: user_badge.user_id,
        grantedById: user_badge.granted_by_id,
        forumUuid: forum.uuid,
      }));
      const badges = data.badges?.map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        longDescription: badge.long_description,
        icon: badge.icon,
        badgeGroupingId: badge.badge_grouping_id,
        badgeTypeId: badge.badge_type_id,
        imageUrl: badge.image_url,
        forumUuid: forum.uuid,
      }));
      const badgeTypes = data.badge_types?.map((badgeType) => ({
        id: badgeType.id,
        name: badgeType.name,
        forumUuid: forum.uuid,
      }));
      const { username } = data.user;

      await this.flowProducer.addBulk([
        {
          name: JOBS.USER,
          queueName: QUEUES.LOAD,
          data: { user, userBadges, badges, badgeTypes },
        },
        {
          name: JOBS.USER_ACTION,
          queueName: QUEUES.EXTRACT,
          data: { forum, username },
        },
      ]);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }

  async load(job: Job<LoadDto, any, string>): Promise<any> {
    try {
      if (job.data.badgeTypes) {
        // Create BadgeTypes
        await this.neo4jService.write(CYPHERS.BULK_CREATE_BADGE_TYPE, job.data);
      }
      if (job.data.badges) {
        // Create Badges
        await this.neo4jService.write(CYPHERS.BULK_CREATE_BADGE, job.data);
      }
      await this.neo4jService.write(CYPHERS.CREATE_USER, job.data);
      await this.neo4jService.write(CYPHERS.BULK_CREATE_USER_BADGES, job.data);
    } catch (error) {
      job.log(error.message);
      throw error;
    }
  }
}

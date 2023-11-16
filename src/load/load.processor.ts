import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BadgesService } from '../badges/badges.service';
import { CategoriesService } from '../categories/categories.service';
import { JOBS } from '../constants/jobs.contants';
import { QUEUES } from '../constants/queues.constants';
import { GroupMembersService } from '../groups-members/group-members.service';
import { GroupsService } from '../groups/groups.service';
import { PostsService } from '../posts/posts.service';
import { TagsService } from '../tags/tags.service';
import { TopicsService } from '../topics/topics.service';
import { UserActionsService } from '../user-actions/user-actions.service';
import { UserBadgesService } from '../user-badges/user-badges.service';
import { BadgeGroupingsService } from '../badge-groupings/badge-groupings.service';
import { BadgeTypesService } from '../badge-types/badge-types.service';
import { TagGroupsService } from '../tag-groups/tag-groups.service';
import { GroupOwnersService } from '../groups-owners/group-owners.service';
import { TopicTagsService } from '../topic-tags/topic-tags.service';
import { UsersService } from '../users/users.service';

@Processor(QUEUES.LOAD, { concurrency: 1 })
export class LoadProcessor extends WorkerHost {
  constructor(
    private readonly badgeGroupingsService: BadgeGroupingsService,
    private readonly badgeTypesService: BadgeTypesService,
    private readonly badgesService: BadgesService,
    private readonly categoriesService: CategoriesService,
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
    private readonly groupOwnersService: GroupOwnersService,
    private readonly postsService: PostsService,
    private readonly tagGroupsService: TagGroupsService,
    private readonly tagsService: TagsService,
    private readonly topicTagsService: TopicTagsService,
    private readonly topicsService: TopicsService,
    private readonly userActionsService: UserActionsService,
    private readonly userBadgesService: UserBadgesService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  process(job: Job<any, any, string>): Promise<any> {
    console.log(job.queueName, job.name);

    switch (job.name) {
      case JOBS.BADGE_GROUPING:
        return this.badgeGroupingsService.load(job);
      case JOBS.BADGE_TYPE:
        return this.badgeTypesService.load(job);
      case JOBS.BADGE:
        return this.badgesService.load(job);
      case JOBS.CATEGORY:
        return this.categoriesService.load(job);
      case JOBS.GROUP:
        return this.groupsService.load(job);
      case JOBS.GROUP_MEMBER:
        return this.groupMembersService.load(job);
      case JOBS.GROUP_OWNER:
        return this.groupOwnersService.load(job);
      case JOBS.POST:
        return this.postsService.load(job);
      case JOBS.TAG_GROUP:
        return this.tagGroupsService.load(job);
      case JOBS.TAG:
        return this.tagsService.load(job);
      case JOBS.TOPIC_TAG:
        return this.topicTagsService.load(job);
      case JOBS.TOPIC:
        return this.topicsService.load(job);
      case JOBS.USER_ACTION:
        return this.userActionsService.load(job);
      case JOBS.USER_BADGE:
        return this.userBadgesService.load(job);
      case JOBS.USER:
        return this.usersService.load(job);
      default:
        break;
    }
  }
}

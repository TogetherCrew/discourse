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
import { UsersService } from '../users/users.service';

@Processor(QUEUES.EXTRACT, {
  concurrency: 100,
  removeOnComplete: { age: 60 * 60 * 24 * 1 },
  removeOnFail: { age: 60 * 60 * 24 * 7 },
})
export class ExtractProcessor extends WorkerHost {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
    private readonly topicsService: TopicsService,
    private readonly categoriesService: CategoriesService,
    private readonly userActionsService: UserActionsService,
    private readonly userBadgesService: UserBadgesService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  process(job: Job<any, any, string>): Promise<any> {
    // console.log(job.queueName, job.name);

    switch (job.name) {
      case JOBS.BADGE:
        return this.badgesService.extract(job);
      case JOBS.GROUP:
        return this.groupsService.extract(job);
      case JOBS.GROUP_MEMBER:
        return this.groupMembersService.extract(job);
      case JOBS.POST:
        return this.postsService.extract(job);
      case JOBS.TAG:
        return this.tagsService.extract(job);
      case JOBS.TOPIC:
        return this.topicsService.extract(job);
      case JOBS.CATEGORY:
        return this.categoriesService.extract(job);
      case JOBS.USER_ACTION:
        return this.userActionsService.extract(job);
      case JOBS.USER_BADGE:
        return this.userBadgesService.extract(job);
      case JOBS.USER:
        return this.usersService.extract(job);
      default:
        break;
    }
  }
}

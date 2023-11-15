import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
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

@Processor(QUEUES.EXTRACT, { concurrency: 2 })
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
    @InjectQueue(QUEUES.EXTRACT) private readonly extractQueue: Queue,
  ) {
    super();
  }

  process(job: Job<any, any, string>): Promise<any> {
    console.log(job.queueName, job.name);

    switch (job.name) {
      case JOBS.BADGES:
        return this.badgesService.extract(job);
      case JOBS.GROUPS:
        return this.groupsService.extract(job);
      case JOBS.GROUP_MEMBERS:
        return this.groupMembersService.extract(job);
      case JOBS.POSTS:
        return this.postsService.extract(job);
      case JOBS.TAGS:
        return this.tagsService.extract(job);
      case JOBS.TOPICS:
        return this.topicsService.extract(job);
      case JOBS.CATEGORIES:
        return this.categoriesService.extract(job);
      case JOBS.USER_ACTIONS:
        return this.userActionsService.extract(job);
      case JOBS.USER_BADGES:
        return this.userBadgesService.extract(job);
      default:
        break;
    }
  }
}

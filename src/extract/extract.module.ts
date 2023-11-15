import { Module } from '@nestjs/common';
import { ExtractProcessor } from './extract.processor';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../constants/queues.constants';
import { BadgesModule } from '../badges/badges.module';
import { GroupsModule } from '../groups/groups.module';
import { GroupMembersModule } from '../groups-members/group-members.module';
import { PostsModule } from '../posts/posts.module';
import { TagsModule } from '../tags/tags.module';
import { TopicsModule } from '../topics/topics.module';
import { UserActionsModule } from '../user-actions/user-actions.module';
import { UserBadgesModule } from '../user-badges/user-badges.module';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.EXTRACT }),
    BullBoardModule.forFeature({
      name: QUEUES.EXTRACT,
      adapter: BullMQAdapter,
    }),
    BadgesModule,
    GroupsModule,
    GroupMembersModule,
    PostsModule,
    TagsModule,
    TopicsModule,
    UserActionsModule,
    UserBadgesModule,
    UsersModule,
    CategoriesModule,
  ],
  providers: [ExtractProcessor],
})
export class ExtractModule {}

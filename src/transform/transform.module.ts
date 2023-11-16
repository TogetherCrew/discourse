import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUES } from '../constants/queues.constants';
import { TransformProcessor } from './transform.processor';
import { BadgeGroupingsModule } from '../badge-groupings/badge-groupings.module';
import { BadgeTypesModule } from '../badge-types/badge-types.module';
import { GroupOwnersModule } from '../groups-owners/group-owners.module';
import { TagGroupsModule } from '../tag-groups/tag-groups.module';
import { TopicTagsModule } from '../topic-tags/topic-tags.module';
import { BadgesModule } from '../badges/badges.module';
import { CategoriesModule } from '../categories/categories.module';
import { GroupMembersModule } from '../groups-members/group-members.module';
import { GroupsModule } from '../groups/groups.module';
import { PostsModule } from '../posts/posts.module';
import { TagsModule } from '../tags/tags.module';
import { TopicsModule } from '../topics/topics.module';
import { UserActionsModule } from '../user-actions/user-actions.module';
import { UserBadgesModule } from '../user-badges/user-badges.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUES.TRANSFORM }),
    BullBoardModule.forFeature({
      name: QUEUES.TRANSFORM,
      adapter: BullMQAdapter,
    }),
    BadgeGroupingsModule,
    BadgeTypesModule,
    BadgesModule,
    CategoriesModule,
    GroupsModule,
    GroupMembersModule,
    GroupOwnersModule,
    PostsModule,
    TagGroupsModule,
    TagsModule,
    TopicTagsModule,
    TopicsModule,
    UserActionsModule,
    UserBadgesModule,
    UsersModule,
  ],
  providers: [TransformProcessor],
  exports: [TransformProcessor],
})
export class TransformModule {}

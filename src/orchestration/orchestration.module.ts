import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { FLOW_PRODUCER } from '../constants/flows.constants';
import { OrchestrationService } from './orchestration.service';
import { EtlSchemaModule } from '../etl-schema/etl-schema.module';
import { BadgeTypesModule } from '../badge-types/badge-types.module';
import { BadgesModule } from '../badges/badges.module';
import { TagGroupsModule } from '../tag-groups/tag-groups.module';
import { TagsModule } from '../tags/tags.module';
import { GroupsModule } from '../groups/groups.module';
import { PostsModule } from '../posts/posts.module';
import { TopicsModule } from '../topics/topics.module';
import { UsersModule } from '../users/users.module';
import { GroupMembersModule } from '../groups-members/group-members.module';
import { GroupOwnersModule } from '../groups-owners/group-owners.module';
import { BadgeGroupingsModule } from '../badge-groupings/badge-groupings.module';
import { CategoriesModule } from '../categories/categories.module';
import { UserActionsModule } from '../user-actions/user-actions.module';
import { UserBadgesModule } from '../user-badges/user-badges.module';
import { ExtractModule } from '../extract/extract.module';
import { TopicTagsModule } from '../topic-tags/topic-tags.module';

@Module({
  imports: [
    BullModule.registerFlowProducer({ name: FLOW_PRODUCER }),
    EtlSchemaModule,
    BadgeTypesModule,
    BadgeGroupingsModule,
    BadgesModule,
    TagGroupsModule,
    TagsModule,
    GroupsModule,
    CategoriesModule,
    TopicsModule,
    PostsModule,
    UsersModule,
    GroupMembersModule,
    GroupOwnersModule,
    UserActionsModule,
    UserBadgesModule,
    ExtractModule,
    TopicTagsModule,
  ],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

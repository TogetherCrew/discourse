import { Module } from '@nestjs/common';
import { BadgeGroupingModule } from './badge-grouping/badge-grouping.module';
import { BadgeTypeModule } from './badge-type/badge-type.module';
import { BadgeModule } from './badge/badge.module';
import { CategoryModule } from './category/category.module';
import { GroupModule } from './group/group.module';
import { TagGroupModule } from './tag-group/tag-group.module';
import { TagModule } from './tag/tag.module';
import { PostModule } from './post/post.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { UserActionModule } from './user-action/user-action.module';

@Module({
  imports: [
    BadgeGroupingModule,
    BadgeTypeModule,
    BadgeModule,
    CategoryModule,
    GroupModule,
    TagGroupModule,
    TagModule,
    PostModule,
    TopicModule,
    UserModule,
    UserActionModule,
  ],
})
export class GraphModule { }

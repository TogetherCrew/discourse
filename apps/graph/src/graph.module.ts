import { Module } from '@nestjs/common';
import { BadgeGroupingModule } from './badge-grouping/badge-grouping.module';
import { BadgeTypeModule } from './badge-type/badge-type.module';
import { BadgeModule } from './badge/badge.module';
import { CategoryModule } from './category/category.module';
import { GroupModule } from './group/group.module';
import { TagGroupModule } from './tag-group/tag-group.module';
import { TagModule } from './tag/tag.module';
import { PostModule } from './post/post.module';

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
  ],
})
export class GraphModule { }

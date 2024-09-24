import { Module } from '@nestjs/common';
import { BadgeGroupingModule } from './badge-grouping/badge-grouping.module';
import { BadgeTypeModule } from './badge-type/badge-type.module';
import { BadgeModule } from './badge/badge.module';
import { CategoryModule } from './category/category.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    BadgeGroupingModule,
    BadgeTypeModule,
    BadgeModule,
    CategoryModule,
    GroupModule,
  ],
})
export class GraphModule { }

import { BaseEtlService } from '../base-etl/base-etl.service';
import { Injectable } from '@nestjs/common';
import { DiscourseService } from '@app/discourse';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { Job } from 'bullmq';

@Injectable()
export class UsersEtlService extends BaseEtlService {
  constructor(
    protected readonly discourseService: DiscourseService,
    protected readonly baseTransformerService: BaseTransformerService,
    protected readonly neo4jService: Neo4jService,
  ) {
    super(discourseService, baseTransformerService, neo4jService);
  }

  // extract(job: Job<any, any, string>): Promise<any> {
  //   const { forum, users } = job.data;
  //   return this.iterate(forum, users);
  // }

  // private async iterate(forum: Forum, users: BasicUser[] = []) {
  //   console.log('EXTRACT USERS', users);
  //   return users.map(async ({ username }) => {
  //     const { data: userData } = await this.discourseService.getUser(
  //       forum.endpoint,
  //       username,
  //     );
  //     // const { badgeData } = await this.discourseService.getUserBadges(
  //     //   forum.endpoint,
  //     //   username,
  //     // );

  //     const { user }: UserResponse = userData;
  //     console.log('Username:', username);
  //     console.log('Extracted User', user);
  //     // const { user_badges }: UserBadgesResponse = badgeData;
  //     // await this.flowProducer.add(this.transformUserBadges(forum, users));
  //     return user;
  //   });
  // }

  async transform(job: Job<any, any, string>): Promise<any> {
    const { forum, users } = job.data;
    // const users = await this.getChildrenValues(job);
    // console.log('# Users', users.length);
    const array = users.map((user) => {
      // console.log(user);
      const obj = this.baseTransformerService.transform(user, {
        forum_uuid: forum.uuid,
      });
      delete obj.associatedAccounts;
      delete obj.groups;
      delete obj.approvedBy;
      delete obj.penaltyCounts;
      delete obj.externalIds;
      return obj;
    });
    return array;
  }
}

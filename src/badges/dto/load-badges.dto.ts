export class LoadBadgeDto {
  id: number;
  name: string;
  description: string;
  grantCount: number;
  allowTitle: boolean;
  multipleGrant: boolean;
  icon: string;
  imageUrl?: string;
  listable: boolean;
  enabled: boolean;
  badgeGroupingId: number;
  system: boolean;
  longDescription: string;
  slug: string;
  manuallyGrantable: boolean;
  query?: string;
  trigger?: number;
  targetPosts: boolean;
  autoRevoke: boolean;
  showPosts: boolean;
  i18nName?: string;
  badgeTypeId: number;
  forumUUID: string;
}

type LoadBadgeTypeDto = {
  id: number;
  name: string;
  sortOrder: number;
};

type LoadBadgeGroupingDto = {
  id: number;
  name: string;
  description?: string;
  position: number;
  system: boolean;
};

export class LoadBadgesDto {
  badges: LoadBadgeDto[];
  badgeTypes: LoadBadgeTypeDto[];
  badgeGroupings: LoadBadgeGroupingDto[];
}

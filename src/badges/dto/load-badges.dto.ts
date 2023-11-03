import { LoadBadgeGroupingDto } from '../../badge-groupings/dto/load-badge-grouping.dto';
import { LoadBadgeTypeDto } from '../../badge-types/dto/load-badge-type.dto';
import { LoadBadgeDto } from './load-badge.dto';

export class LoadBadgesDto {
  badges: LoadBadgeDto[];
  badgeTypes: LoadBadgeTypeDto[];
  badgeGroupings: LoadBadgeGroupingDto[];
}

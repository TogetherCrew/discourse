import { Injectable } from '@nestjs/common';
import { LoadBadgeDto } from './dto/load-badges.dto';
import { addForumUUID } from 'src/utils/transformers/addForumUUID.transformer';
import { camelize } from 'src/utils/transformers/camelize.transformer';

@Injectable()
export class BadgesTransformer {
  transform(badge: Badge, forum: any): LoadBadgeDto {
    let output = addForumUUID(badge, forum.uuid);
    output = camelize(output);
    return output;
  }
}

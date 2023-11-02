import { Injectable } from '@nestjs/common';
import { LoadBadgeDto } from './dto/load-badges.dto';
import { addForumUUID } from '../utils/transformers/addForumUUID.transformer';
import { camelize } from '../utils/transformers/camelize.transformer';

@Injectable()
export class BadgesTransformer {
  transform(badge: Badge, forum: any): LoadBadgeDto {
    console.log('badge', badge);
    let output;
    output = addForumUUID(badge, forum.uuid);
    console.log('addForumUUID', output);
    output = camelize(output);
    console.log('camelize', output);
    return output;
  }
}

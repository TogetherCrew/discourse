import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransformService } from '../transform/transform.service.';

@Injectable()
export class UserActionService {
  private readonly logger = new Logger(UserActionService.name);

  private readonly LIKED = [
    'MERGE (u:DiscourseUser { id: $obj.actingUserId, endpoint: $obj.endpoint })',
    'MERGE (p:DiscoursePost { topicId: $obj.topicId, postNumber: $obj.postNumber, endpoint: $obj.endpoint })',
    'MERGE (u)-[obj:LIKED]->(p)',
    'SET obj += $obj',
  ].join(' ');

  constructor(
    private readonly transformService: TransformService,
    private readonly neo4jService: Neo4jService,
  ) { }

  async create(dto: UserAction, endpoint): Promise<void> {
    this.logger.debug(`action code: ${dto.action_type}`);
    const obj = this.transformService.transform(dto, { endpoint });

    switch (obj.action_type) {
      case 1:
        await this.neo4jService.write(this.LIKED, { obj });
        break;
      default:
        break;
    }
  }
}

// LIKE = 1
// WAS_LIKE = 2
// NEW_TOPIC = 4
// REPLY = 5
// RESPONSE = 6
// MENTION = 7
// QUOTE = 9
// EDIT = 11
// NEW_PRIVATE_MESSAGE = 12
// GOT_PRIVATE_MESSAGE = 13
// SOLVED = 15
// ASSIGNED = 16

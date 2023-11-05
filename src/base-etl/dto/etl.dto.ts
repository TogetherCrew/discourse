import { Forum } from 'src/forums/entities/forum.entity';

export class EtlDto {
  forum: Forum;
  operation: string;
  property: string;
  cypher: string;
}

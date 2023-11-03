import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsRepository } from './forums.repository';

@Injectable()
export class ForumsService {
  constructor(private readonly forumsRepository: ForumsRepository) {}

  create(createForumDto: CreateForumDto) {
    return this.forumsRepository.insertOne(createForumDto);
  }
}

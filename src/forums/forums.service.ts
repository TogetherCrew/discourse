import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumsRepository } from './forums.repository';

@Injectable()
export class ForumsService {
  constructor(private readonly forumsRepository: ForumsRepository) {}

  create(createForumDto: CreateForumDto) {
    return this.forumsRepository.insertOne(createForumDto);
  }

  findAll() {
    return `This action returns all forums`;
  }

  findOne(id: number) {
    return `This action returns a #${id} forum`;
  }

  update(id: number, updateForumDto: UpdateForumDto) {
    return `This action updates a #${id} forum`;
  }

  remove(id: number) {
    return `This action removes a #${id} forum`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsRepository } from './forums.repository';
import { OrchestrationService } from '../orchestration/orchestration.service';
import { Forum } from './entities/forum.entity';
import { UpdateForumDto } from './dto/update-forum.dto';

@Injectable()
export class ForumsService {
  constructor(
    private readonly forumsRepository: ForumsRepository,
    private readonly orchestrationService: OrchestrationService,
  ) {}

  async create(createForumDto: CreateForumDto): Promise<Forum> {
    const forum = await this.forumsRepository.insertOne(createForumDto);
    this.orchestrationService.run(forum);
    return forum;
  }

  async update(uuid: string, updateForumDto: UpdateForumDto): Promise<Forum> {
    const forum = await this.forumsRepository.updateOne(uuid, updateForumDto);
    this.orchestrationService.run(forum);
    return forum;
  }
}

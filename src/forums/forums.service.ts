import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsRepository } from './forums.repository';
import { OrchestrationService } from '../orchestration/orchestration.service';
import { Forum } from './entities/forum.entity';

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
}

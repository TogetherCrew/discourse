import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { ForumsRepository } from './forums.repository';

@Module({
  controllers: [ForumsController],
  providers: [ForumsService, ForumsRepository],
})
export class ForumsModule {}

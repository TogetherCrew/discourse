import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { ForumsRepository } from './forums.repository';
import { OrchestrationModule } from 'src/orchestration/orchestration.module';

@Module({
  imports: [OrchestrationModule],
  controllers: [ForumsController],
  providers: [ForumsService, ForumsRepository],
})
export class ForumsModule {}

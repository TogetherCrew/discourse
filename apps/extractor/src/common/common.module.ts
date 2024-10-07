import { Module } from '@nestjs/common';
import { DiscourseModule } from '@app/discourse';
import { RmqModule, Services } from '@app/common';

@Module({
  imports: [DiscourseModule, RmqModule.register(Services.graph)],
  exports: [DiscourseModule, RmqModule],
})
export class CommonModule { }

import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { Phase2Service } from './phase2.service';
import { RmqModule, Services } from '@app/common';
import { AirflowModule } from '../airflow/airflow.module';
import { CronModule } from '../cron/cron.module';

@Module({
  imports: [
    CommonModule,
    RmqModule.register(Services.mongo),
    AirflowModule,
    CronModule,
  ],
  providers: [Phase2Service],
  exports: [Phase2Service],
})
export class Phase2Module { }

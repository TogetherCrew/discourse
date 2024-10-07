import { Module } from '@nestjs/common';
import { AirflowService } from './airflow.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AirflowService],
  exports: [AirflowService],
})
export class AirflowModule { }

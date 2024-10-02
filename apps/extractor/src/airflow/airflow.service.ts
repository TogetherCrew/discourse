import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

@Injectable()
export class AirflowService {
  private readonly logger = new Logger(AirflowService.name);
  private readonly url;
  private readonly auth;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const username = this.configService.get<string>('airflow.username');
    const password = this.configService.get<string>('airflow.password');
    const baseUrl = this.configService.get<string>('airflow.baseUrl');
    this.url = `${baseUrl}/api/v1/dags/discourse_analyzer_etl/dagRuns`;
    this.auth = Buffer.from(`${username}:${password}`).toString('base64');
  }

  async dagRuns(endpoint: string) {
    const dag_run_id = uuidv4();
    const logical_date = moment().add(1, 'minute').toISOString();
    const body = {
      dag_run_id,
      logical_date,
      conf: {
        endpoint,
      },
      note: 'compute',
    };

    await this.httpService.axiosRef.post(this.url, body, {
      headers: { 'Content-Type': 'application/json', Authorization: this.auth },
    });
  }
}

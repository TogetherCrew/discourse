import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PlatformDocument } from 'apps/mongo/src/schemas/platform.schema';

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

  async dagRuns(platform: PlatformDocument) {
    const dag_run_id = uuidv4();

    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);

    const logical_date = date.toISOString();
    const body = {
      dag_run_id,
      logical_date,
      conf: {
        platform_id: platform._id,
        period: platform.metadata.period,
        id: platform.metadata.id,
        recompute: false,
      },
      note: 'compute',
    };

    try {
      await this.httpService.axiosRef.post(this.url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
      });
    } catch (error) {
      this.logger.error(error, this.url, body);
    }
  }
}

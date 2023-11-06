import { Injectable } from '@nestjs/common';
import { FlowJob } from 'bullmq';
import { JOBS } from '../constants/jobs.contants';
import { EtlDto } from 'src/base-etl/dto/etl.dto';

@Injectable()
export class EtlSchemaService {
  etl(queue: string, data: EtlDto, children?: FlowJob[]): FlowJob {
    return this.load(queue, data, children);
  }

  private extract(
    queue: string,
    data: EtlDto,
    children: [] | FlowJob[] = [],
  ): FlowJob {
    return {
      name: JOBS.EXTRACT,
      queueName: queue,
      data,
      children,
    };
  }

  private transform(
    queue: string,
    data: EtlDto,
    children?: FlowJob[],
  ): FlowJob {
    return {
      name: JOBS.TRANSFORM,
      queueName: queue,
      data,
      children: [this.extract(queue, data, children)],
    };
  }

  private load(queue: string, data: EtlDto, children?: FlowJob[]): FlowJob {
    return {
      name: JOBS.LOAD,
      queueName: queue,
      data,
      children: [this.transform(queue, data, children)],
    };
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class EventsInterceptor implements NestInterceptor {
  constructor(private readonly rmqService: RmqService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext<RmqContext>();
    return next.handle().pipe(
      tap(() => {
        this.rmqService.ack(ctx);
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from 'request-ip';
import { MyLogger } from './logger/logger.service';

@Injectable()
export class IpInterceptor implements NestInterceptor {
  constructor(private readonly logger: MyLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log(requestIp.getClientIp(context.switchToHttp().getRequest()));
    return next.handle();
  }
}

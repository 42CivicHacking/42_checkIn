import {
  BadRequestException,
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
  // constructor(private readonly logger: MyLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // this.logger.log(requestIp.getClientIp(context.switchToHttp().getRequest()));
    const ip = requestIp.getClientIp(context.switchToHttp().getRequest());
    if (!(ip == '::1' || ip == 'localhost' || ip == '121.135.181.35'))
      throw new BadRequestException();
    return next.handle();
  }
}

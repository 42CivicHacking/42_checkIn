import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  //   handleRequest(err, user, info, context: ExecutionContext) {
  //     if (err || !user) {
  //       const res = context.switchToHttp().getResponse();
  //     }
  //     return user;
  //   }
}

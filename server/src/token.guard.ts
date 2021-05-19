import { ThrottlerGuard } from '@nestjs/throttler';

export class TokenThrottlerGuard extends ThrottlerGuard {
  getTracker(req): string {
    return req.cookies.w_auth;
  }
}

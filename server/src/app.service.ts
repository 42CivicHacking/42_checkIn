import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

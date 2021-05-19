import { HttpService, Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User } from './user/entities/user.entity';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getToken(ftToken: string) {
    const header_req = {
      Authorization: 'Bearer ' + ftToken,
    };
    const returnVal = (
      await this.httpService
        .get('https://api.intra.42.fr/v2/me', {
          headers: header_req,
        })
        .toPromise()
    ).data;
    const user = new User(returnVal.id, returnVal.login, returnVal.email);
    return this.authService.generateToken(user);
  }
}

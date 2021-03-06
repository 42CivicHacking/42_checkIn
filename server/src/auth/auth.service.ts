import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MyLogger } from 'src/logger/logger.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly logger: MyLogger,
  ) {}

  /* passport 로 대체됨 */
  // async validateUser(code: string): Promise<User> {
  //   const form = new FormData();
  //   form.append('grant_type', 'authorization_code');
  //   form.append('client_id', this.configService.get('client.id'));
  //   form.append('client_secret', this.configService.get('client.secret'));
  //   form.append('code', code);
  //   form.append('redirect_uri', 'http://13.209.202.141/temp');
  //   const token: string = (
  //     await this.httpService
  //       .post('https://api.intra.42.fr/oauth/token', form, {
  //         headers: { ...form.getHeaders() },
  //       })
  //       .toPromise()
  //   ).data.access_token;
  //   const header_req = {
  //     Authorization: 'Bearer ' + token,
  //   };
  //   const returnVal = (
  //     await this.httpService
  //       .get('https://api.intra.42.fr/v2/me', {
  //         headers: header_req,
  //       })
  //       .toPromise()
  //   ).data;
  //   const user = new User(returnVal.id, returnVal.login);
  //   return user;
  // }

  async generateToken(user: User): Promise<string> {
    try {
      this.logger.debug('generating token...');
      const payload = { username: user.getName(), sub: user.getId() };
      const token = this.jwtService.sign(payload);
      this.logger.debug('new token generated : ', token);
      return token;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

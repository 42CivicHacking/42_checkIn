import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('client.id'),
      clientSecret: configService.get('client.secret'),
      callbackURL: 'http://cluster.42seoul.io/api/user/login/callback',
    });
  }
  async validate(token: string, rt: string, profile: any) {
    const user = new User(profile.id, profile.username);
    if (profile._json.cursus_users.length < 2)
      throw new NotAcceptableException();
    console.log(profile._json.cursus_users.length);
    return user;
  }
}

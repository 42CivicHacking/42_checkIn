import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('client.id'),
      clientSecret: configService.get('client.secret'),
      callbackURL: 'http://13.209.202.141/api/user/login',
    });
  }
  async validate(payload: any) {
    console.log(payload);
    return payload;
  }
}

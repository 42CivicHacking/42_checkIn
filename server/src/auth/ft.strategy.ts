import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientId: configService.get('client.id'),
      clientSecret: configService.get('client.secret'),
      callbackURL: 'http://localhost:3000/user/login/callback',
    });
  }
  async validate(payload: any) {
    console.log(payload);
  }
}

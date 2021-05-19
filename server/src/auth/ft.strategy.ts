import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { MyLogger } from 'src/logger/logger.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: MyLogger,
  ) {
    super({
      clientID: configService.get('client.id'),
      clientSecret: configService.get('client.secret'),
      callbackURL: configService.get('client.callback'),
    });
  }
  async validate(token: string, rt: string, profile: any) {
    try {
      this.logger.debug('oauth validation start');
      const user = new User(
        profile.id,
        profile.username,
        profile.emails[0].value,
      );
      this.logger.debug('authroized info : ', profile.id, profile.username);
      if (profile._json.cursus_users.length < 2)
        throw new NotAcceptableException();
      return user;
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }
}

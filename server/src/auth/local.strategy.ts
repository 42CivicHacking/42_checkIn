// import { Strategy } from 'passport-local';
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { User } from 'src/user/entities/user.entity';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({ usernameField: 'code', passwordField: 'code' });
//   }

//   async validate(code: string): Promise<User> {
//     return await this.authService.validateUser(code);
//   }
// }

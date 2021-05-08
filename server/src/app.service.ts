import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getToken(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    return await this.authService.generateToken(user);
  }
}

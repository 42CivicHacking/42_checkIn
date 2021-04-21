import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CardRepository } from 'src/card/card.repository';
import { LogService } from 'src/log/log.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly cardRepository: CardRepository,
    private readonly logService: LogService,
  ) {}
  async login(user: User) {
    if (!(await this.userRepository.findOne(user.getId()))) {
      this.userRepository.save(user);
    }
    // UseGuards에서 넘어온 user로 JWT token 생성
    const token = await this.authService.generateToken(user);
    // token userSession에 Insert
    return token;
  }
  async checkIn(id: number, cardId: number) {
    const card = await this.cardRepository.useCard(cardId);
    const user = await this.userRepository.setCard(id, card);
    await this.logService.createLog(user, card, 'checkIn');
  }
  async checkOut(id: number) {
    const card = await this.userRepository.getCard(id);
    console.log(card);
    await this.cardRepository.returnCard(card);
    const user = await this.userRepository.clearCard(id);
    await this.logService.createLog(user, card, 'checkOut');
  }
}

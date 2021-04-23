import { Injectable, NotFoundException } from '@nestjs/common';
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

  async login(user: User): Promise<string> {
    //처음 사용하는 유저의 경우 db에 등록
    if (!(await this.userRepository.findOne(user.getId()))) {
      await this.userRepository.save(user);
    }
    // UseGuards에서 넘어온 user로 JWT token 생성
    return await this.authService.generateToken(user);
  }

  async status(id: number): Promise<Object> {
    let returnVal = { login: '', card: 0 };
    const user = await this.userRepository.findOne(id, { relations: ['card'] });
    if (!user) throw new NotFoundException();
    returnVal.login = user.getName();
    returnVal.card = user.getCard() ? user.getCard().getId() : null;
    return returnVal;
  }

  async checkIn(id: number, cardId: number) {
    const card = await this.cardRepository.useCard(cardId);
    const user = await this.userRepository.setCard(id, card);
    await this.logService.createLog(user, card, 'checkIn');
  }

  async checkOut(id: number) {
    const card = await this.userRepository.getCard(id);
    await this.cardRepository.returnCard(card);
    const user = await this.userRepository.clearCard(id);
    await this.logService.createLog(user, card, 'checkOut');
  }
}

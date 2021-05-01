import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CardRepository } from 'src/card/card.repository';
import { CardService } from 'src/card/card.service';
import { LogService } from 'src/log/log.service';
import { MyLogger } from 'src/logger/logger.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly cardRepository: CardRepository,
    @Inject(forwardRef(() => CardService))
    private readonly cardServcie: CardService,
    private readonly logService: LogService,
    private readonly logger: MyLogger,
  ) {}

  async login(user: User): Promise<string> {
    //처음 사용하는 유저의 경우 db에 등록
    if (
      !(user = await this.userRepository.findOne({
        where: { userId: user.getUserId() },
      }))
    ) {
      await this.userRepository.save(user);
    }
    // UseGuards에서 넘어온 user로 JWT token 생성
    return await this.authService.generateToken(user);
  }

  async status(id: number): Promise<Object> {
    let returnVal = {
      login: '',
      card: 0,
      gaepo: 0,
      seocho: 0,
      isAdmin: false,
    };
    const user = await this.userRepository.findWithCard(id);
    const using = await this.cardServcie.getUsingInfo();
    returnVal.login = user.getName();
    returnVal.card = user.getCard() ? user.getCard().getId() : null;
    returnVal.isAdmin = user.getIsAdmin();
    returnVal.gaepo = using.gaepo;
    returnVal.seocho = using.seocho;
    return returnVal;
  }

  async checkIn(id: number, cardId: number) {
    try {
      const card = await this.cardRepository.useCard(cardId);
      const user = await this.userRepository.setCard(id, card);
      await this.logService.createLog(user, card, 'checkIn');
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async checkOut(id: number) {
    try {
      const card = await this.userRepository.getCard(id);
      await this.cardRepository.returnCard(card);
      const user = await this.userRepository.clearCard(id);
      await this.logService.createLog(user, card, 'checkOut');
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async checkIsAdmin(adminId: number) {
    const admin = await this.userRepository.findOne(adminId);
    if (!admin.getIsAdmin()) throw new ForbiddenException();
  }

  async forceCheckOut(adminId: number, userId: number) {
    try {
      this.checkIsAdmin(adminId);
      const card = await this.userRepository.getCard(userId);
      await this.cardRepository.returnCard(card);
      const user = await this.userRepository.clearCard(userId);
      await this.logService.createLog(user, card, 'forceCheckOut');
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }
}

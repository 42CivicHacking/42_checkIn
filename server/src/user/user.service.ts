import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpService,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { CardRepository } from 'src/card/card.repository';
import { CardService } from 'src/card/card.service';
import { LogService } from 'src/log/log.service';
import { MyLogger } from 'src/logger/logger.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as FormData from 'form-data';

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
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async login(user: User): Promise<string> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { userId: user.getUserId() },
      });
      //처음 사용하는 유저의 경우 db에 등록
      if (!existingUser) {
        await this.userRepository.save(user);
        this.logger.debug('new user save : ', user);
      }
      this.logger.debug('Login user : ', existingUser);
      // UseGuards에서 넘어온 user로 JWT token 생성
      return await this.authService.generateToken(
        existingUser ? existingUser : user,
      );
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async status(id: number): Promise<Object> {
    try {
      let returnVal = {
        login: '',
        card: 0,
        gaepo: 0,
        seocho: 0,
        isAdmin: false,
      };
      this.logger.debug('status start');
      this.logger.debug('user _id: ', id);
      const user = await this.userRepository.findWithCard(id);
      const using = await this.cardServcie.getUsingInfo();
      returnVal.login = user.getName();
      returnVal.card = user.getCard() ? user.getCard().getId() : null;
      returnVal.isAdmin = user.getIsAdmin();
      returnVal.gaepo = using.gaepo;
      returnVal.seocho = using.seocho;
      this.logger.debug('status returnVal : ', returnVal);
      return returnVal;
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async checkIn(id: number, cardId: number) {
    try {
      this.logger.debug('checkIn start');
      this.logger.debug('user _id, cardNum', id, cardId);
      //useCard
      const card = await this.cardRepository.findOne(cardId);
      if (!card) throw new NotFoundException();
      if (card.getStatus()) throw new BadRequestException();
      const usingCard = (
        await this.cardRepository.find({
          where: { using: true, type: card.getType() },
        })
      ).length;
      if (usingCard >= 145) {
        const form = new FormData();
        form.append('content', `${150 - usingCard}명 남았습니다`);
        if (card.getType() === 0) {
          const dis_id = this.configService.get('discord.gaepo.id');
          const dis_pw = this.configService.get('discord.gaepo.pw');
          await this.httpService
            .post(
              `https://discord.com/api/webhooks/${dis_id}/${dis_pw}`,
              form,
              { headers: { ...form.getHeaders() } },
            )
            .toPromise();
        }
        if (card.getType() === 1) {
          const dis_id = this.configService.get('discord.seocho.id');
          const dis_pw = this.configService.get('discord.seocho.pw');
          await this.httpService
            .post(
              `https://discord.com/api/webhooks/${dis_id}/${dis_pw}`,
              form,
              { headers: { ...form.getHeaders() } },
            )
            .toPromise();
        }
      }
      if (usingCard >= 150) throw new BadRequestException();
      card.useCard();
      await this.cardRepository.save(card);
      //end
      const user = await this.userRepository.setCard(id, card);
      await this.logService.createLog(user, card, 'checkIn');
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async checkOut(id: number) {
    try {
      this.logger.debug('checkOut start');
      this.logger.debug('user _id', id);
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
    this.logger.debug('checkIsAdmin start');
    this.logger.debug('user _id', adminId);
    const admin = await this.userRepository.findOne(adminId);
    if (!admin.getIsAdmin()) throw new ForbiddenException();
  }

  async forceCheckOut(adminId: number, userId: number) {
    try {
      this.logger.debug('forceCheckOut start');
      this.logger.debug('admin _id, uesr _id', adminId, userId);
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

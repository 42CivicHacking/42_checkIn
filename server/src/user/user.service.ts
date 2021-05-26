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
import { WaitingService } from 'src/waiting/waiting.service';
import { WaitingRepository } from 'src/waiting/waiting.repository';
import { StatusDTO } from './dto/status.dto';
import { ClusterDTO } from './dto/cluster.dto';

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
    private readonly waitingService: WaitingService,
    private readonly waitingRepository: WaitingRepository,
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
      } else {
        existingUser.setEmail(user.getEmail());
        await this.userRepository.save(existingUser);
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
        user: null,
        cluster: null,
        isAdmin: false,
      };
      this.logger.debug('status start');
      this.logger.debug('user _id: ', id);

      const user = await this.userRepository.findWithCard(id);
      // const waiting = await this.waitingService.isWaiting(user.getId());
      // const waitingNum = waiting
      // ? await this.waitingService.waitNum(user.getId(), waiting.getType())
      // : null;

      // const userInfo = new StatusDTO(user, waitingNum, waiting);
      const userInfo = new StatusDTO(user, null, null);
      const using = await this.cardServcie.getUsingInfo();
      // const waitingList = await this.waitingService.getWaitingInfo();
      const cluster = new ClusterDTO(
        using.gaepo,
        using.seocho,
        null,
        null,
        // waitingList.gaepo,
        // waitingList.seocho,
      );

      returnVal.user = userInfo;
      returnVal.isAdmin = user.getIsAdmin();
      returnVal.cluster = cluster;
      this.logger.debug('status returnVal : ', returnVal);
      return returnVal;
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  async noticer(type: number, usingCard: number) {
    if (usingCard >= 145) {
      const form = new FormData();
      form.append('content', `${150 - usingCard}명 남았습니다`);
      if (type === 0) {
        const dis_id = this.configService.get('discord.gaepo.id');
        const dis_pw = this.configService.get('discord.gaepo.pw');
        await this.httpService
          .post(`https://discord.com/api/webhooks/${dis_id}/${dis_pw}`, form, {
            headers: { ...form.getHeaders() },
          })
          .toPromise();
      }
      if (type === 1) {
        const dis_id = this.configService.get('discord.seocho.id');
        const dis_pw = this.configService.get('discord.seocho.pw');
        await this.httpService
          .post(`https://discord.com/api/webhooks/${dis_id}/${dis_pw}`, form, {
            headers: { ...form.getHeaders() },
          })
          .toPromise();
      }
    }
  }

  async checkIn(id: number, cardId: number) {
    try {
      this.logger.debug('checkIn start');
      this.logger.debug('user _id, cardNum', id, cardId);
      //카드 유효성 확인
      const card = await this.cardRepository.findOne(cardId);
      if (!card) throw new NotFoundException();
      if (card.getStatus()) throw new BadRequestException();
      //카드 유효성 확인 끝

      //현재 이용자 수 확인
      const usingCard = (
        await this.cardRepository.find({
          where: { using: true, type: card.getType() },
        })
      ).length;
      //150명 다 찼으면 체크인 불가
      if (usingCard >= 150 && card.getType() == 0)
        throw new BadRequestException();
      if (usingCard >= 90 && card.getType() == 1)
        throw new BadRequestException();

      //대기자 수와 현재 사용자 수 합쳐서 150명 넘으면 대기자만 체크인 가능
      const waitingNum = (await this.waitingService.waitingList(card.getType()))
        .length;
      if (waitingNum > 0) {
        const waiting = await this.waitingRepository.findOne({
          where: { userId: id, deleteType: null },
        });
        if (!waiting && waitingNum + usingCard >= 150)
          throw new NotFoundException();
        else if (waiting)
          await this.waitingService.delete(waiting.getId(), 'checkIn');
      }
      //대기자 명단에 없으면 NotFoundException

      //모두 통과 후 카드 사용 프로세스
      card.useCard();
      await this.cardRepository.save(card);
      const user = await this.userRepository.setCard(id, card);
      //카드 사용 프로세스 종료

      //몇 명 남았는지 디스코드로 노티
      await this.noticer(card.getType(), usingCard + 1);

      //로그 생성
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

      //반납 프로세스
      const card = await this.userRepository.getCard(id);
      const type = card.getType();
      await this.cardRepository.returnCard(card);
      const user = await this.userRepository.clearCard(id);
      //반납 프로세스 종료

      //사용량 조회
      const usingCard = (
        await this.cardRepository.find({
          where: { using: true, type: type },
        })
      ).length;

      //한자리 났다고 노티
      await this.noticer(type, usingCard);

      //대기열 카운트 다운 시작
      await this.waitingService.wait(149 - usingCard, type);

      //로그 생성
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

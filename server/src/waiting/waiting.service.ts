import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { CardRepository } from 'src/card/card.repository';
import { UserRepository } from 'src/user/user.repository';
import { Waiting } from './entities/waiting.entity';
import { WaitingRepository } from './waiting.repository';

@Injectable()
export class WaitingService {
  constructor(
    private readonly waitingRepository: WaitingRepository,
    private readonly userRepository: UserRepository,
    private readonly cardRepository: CardRepository,
  ) // private readonly mailerService: MailerService,
  {}

  async create(id: number, type: number) {
    const user = await this.userRepository.findOne(id);
    const exist = await this.waitingRepository.find({
      relations: ['user'],
      where: { user: { _id: id }, deleteType: null },
    });
    if (exist.length > 0) throw new BadRequestException();
    const waiting = new Waiting(user, type);
    this.waitingRepository.save(waiting);
  }

  async mailer(userId: number, timeOut: Date) {
    const user = await this.userRepository.findOne(userId);
    const email = user.getEmail();
    const date = timeOut.toLocaleTimeString();
    await this.mailerService
      .sendMail({
        to: email, // list of receivers
        from: '42checkin@gmail.com', // sender address
        subject: '이제 입장하실 수 있습니다.', // Subject line
        template: 'waitingMail', // HTML body content
        context: {
          timeOut: date,
        },
      })
      .then(() => {})
      .catch(() => {});
  }

  async wait(order: number, type: number) {
    if (order < 0) throw new BadRequestException();
    const waiting = await this.waitingRepository.find({
      where: { deleteType: null, type: type },
      order: { deletedAt: 'ASC' },
    });
    if (!waiting) return;
    if (waiting.length < order) return;

    waiting[order].setTimeOut();
    await this.mailer(waiting[order].getUserId(), waiting[order].getTimeOut());
    await this.waitingRepository.save(waiting[order]);

    this.next(waiting[order]);
    // const now = new Date();
    // setTimeout(
    //   this.next,
    //   waiting[order].getTimeOut().getTime() - now.getTime(),
    //   waiting[order],
    // );
  }

  @Timeout(1000 * 60 * 1)
  async next(waiting: Waiting) {
    if (await this.delete(waiting.getId(), 'timeOut')) {
      const usingCard = (
        await this.cardRepository.find({
          where: { using: true, type: waiting.getType() },
        })
      ).length;
      this.wait(149 - usingCard, waiting.getType());
    }
  }

  async getWaitingInfo() {
    const gaepo = await this.waitingList(0);
    const seocho = await this.waitingList(1);
    return { gaepo: gaepo.length, seocho: seocho.length };
  }

  async waitingList(type: number) {
    return await this.waitingRepository.find({
      where: { type: type, deleteType: null },
    });
  }

  async waitNum(id: number, type: number) {
    const waitingList = await this.waitingList(type);
    const num = waitingList.findIndex((ele, index) => {
      return ele.getUserId() === id;
    });
    return num + 1;
  }

  async isWaiting(id: number) {
    const waiting = await this.waitingRepository.find({
      where: { user: { _id: id }, deleteType: null },
    });
    return waiting[0];
  }

  async delete(id: number, type: string) {
    const waiting = await this.waitingRepository.findOne({
      where: { waitingId: id, deleteType: null },
    });
    if (!waiting && type == 'timeOut') return false;
    else if (!waiting) throw new NotFoundException();
    waiting.setDeleted(type);
    await this.waitingRepository.save(waiting);
    return true;
  }

  async cancel(id: number) {
    const waiting = await this.waitingRepository.findOne({
      relations: ['user'],
      where: { user: { _id: id }, deleteType: null },
    });
    if (!waiting) throw new NotFoundException();
    this.delete(waiting.getId(), 'cancel');
  }
}

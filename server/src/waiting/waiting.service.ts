import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

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

  async wait(order: number, type: number) {
    if (order < 0) throw new BadRequestException();
    const waiting = await this.waitingRepository.find({
      where: { deleteType: null, type: type },
      order: { deletedAt: 'ASC' },
    });
    if (!waiting) return;
    if (waiting.length < order) return;
    waiting[order].setTimeOut();
    const now = new Date();
    setTimeout(
      this.next,
      waiting[order].getTimeOut().getTime() - now.getTime(),
      waiting[order],
    );
  }

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

  async waitingList(type: number) {
    return await this.waitingRepository.find({
      where: { type: type, deleteType: null },
    });
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

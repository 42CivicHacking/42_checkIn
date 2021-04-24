import { Injectable } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Log } from './entities/log.entity';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserLog(login: string): Promise<Log[]> {
    return await this.logRepository.find({
      relations: ['user'],
      where: (qb) => {
        qb.where('Log__user.userName = :name', { name: login });
      },
    });
  }

  async getCardLog(id: number): Promise<Log[]> {
    return await this.logRepository.find({
      where: { card: { cardId: id } },
      relations: ['user'],
    });
  }

  async getAll(): Promise<Log[]> {
    return await this.logRepository.find();
  }

  async createLog(user: User, card: Card, type: string): Promise<void> {
    const log = new Log(user, card, type);
    await this.logRepository.save(log);
  }

  async getCluster(type: number, page: number): Promise<Log[]> {
    const logs = await this.logRepository.find({
      relations: ['user', 'card'],
      where: (qb) => {
        qb.where('Log__card.type = :type', { type: type });
      },
      skip: 50 * page,
      take: 50,
    });
    console.log('type', type, 'page', page);
    console.log(logs);
    return logs;
  }
}

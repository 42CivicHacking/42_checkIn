import { Injectable } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Log } from './entities/log.entity';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async getUserLog(login: string): Promise<Log[]> {
    try {
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__user.userName = :name', { name: login });
        },
        order: { createdAt: 'DESC' },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getCardLog(id: number): Promise<Log[]> {
    try {
      return await this.logRepository.find({
        where: { card: { cardId: id } },
        order: { createdAt: 'DESC' },
        relations: ['user', 'card'],
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAll(): Promise<Log[]> {
    try {
      return await this.logRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['user', 'card'],
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createLog(user: User, card: Card, type: string): Promise<void> {
    try {
      const log = new Log(user, card, type);
      await this.logRepository.save(log);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getCluster(type: number, page: number): Promise<Log[]> {
    try {
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__card.type = :type', { type: type });
        },
        order: { createdAt: 'DESC' },
        skip: 50 * page,
        take: 50,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

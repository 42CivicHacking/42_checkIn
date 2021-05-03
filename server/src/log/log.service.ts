import { Injectable } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { MyLogger } from 'src/logger/logger.service';
import { User } from 'src/user/entities/user.entity';
import { Log } from './entities/log.entity';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly logger: MyLogger,
  ) {}

  async getUserLog(login: string): Promise<Log[]> {
    try {
      this.logger.log('getUserLog start');
      this.logger.log('userName : ', login);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__user.userName = :name', { name: login });
        },
        order: { createdAt: 'DESC' },
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCardLog(id: number): Promise<Log[]> {
    try {
      this.logger.log('getCardLog start');
      this.logger.log('cardId : ', id);
      return await this.logRepository.find({
        where: { card: { cardId: id } },
        order: { createdAt: 'DESC' },
        relations: ['user', 'card'],
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAll(): Promise<Log[]> {
    try {
      this.logger.log('[ spreadsheet parser working... ] get all log');
      return await this.logRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['user', 'card'],
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async createLog(user: User, card: Card, type: string): Promise<void> {
    try {
      this.logger.log('createLog start');
      this.logger.log('_id, cardId, type : ', user.getId(), card.getId(), type);
      const log = new Log(user, card, type);
      await this.logRepository.save(log);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCluster(type: number, page: number): Promise<Log[]> {
    try {
      this.logger.log('getClusterLog start');
      this.logger.log('clusterType, page : ', type, page);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__card.type = :type', { type: type });
        },
        order: { createdAt: 'DESC' },
        // skip: 50 * page,
        // take: 50,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCheckIn(type: number): Promise<Log[]> {
    try {
      this.logger.log('getCheckIn Start');
      this.logger.log('type : ', type);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__card.type = :type', {
            type: type,
          }).andWhere('Log__user.cardId = Log__card.cardId');
        },
        order: { createdAt: 'DESC' },
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAllCard(type: number): Promise<Log[]> {
    try {
      this.logger.log('getAllCardLog Start');
      this.logger.log('type : ', type);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__card.type = :type', {
            type: type,
          }).andWhere('Log__user.cardId = Log__card.cardId');
        },
        order: { cardId: 'ASC' },
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

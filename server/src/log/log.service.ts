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

  async getUserLog(login: string, page: number): Promise<Log[]> {
    try {
      this.logger.debug('getUserLog start');
      this.logger.debug('userName : ', login);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__user.userName = :name', { name: login });
        },
        order: { createdAt: 'DESC' },
        skip: 50 * page,
        take: 50,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCardLog(id: number, page: number): Promise<Log[]> {
    try {
      this.logger.debug('getCardLog start');
      this.logger.debug('cardId : ', id);
      return await this.logRepository.find({
        where: { card: { cardId: id } },
        order: { createdAt: 'DESC' },
        relations: ['user', 'card'],
        skip: 50 * page,
        take: 50,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getAll(): Promise<Log[]> {
    try {
      this.logger.debug('[ spreadsheet parser working... ] get all log');
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
      this.logger.debug('createLog start');
      this.logger.debug(
        '_id, cardId, type : ',
        user.getId(),
        card.getId(),
        type,
      );
      const log = new Log(user, card, type);
      await this.logRepository.save(log);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCluster(type: number, page: number): Promise<Log[]> {
    try {
      this.logger.debug('getClusterLog start');
      this.logger.debug('clusterType, page : ', type, page);
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
      this.logger.error(e);
      throw e;
    }
  }

  async getCheckIn(type: number): Promise<Log[]> {
    try {
      this.logger.debug('getCheckIn Start');
      this.logger.debug('type : ', type);
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
      this.logger.debug('getAllCardLog Start');
      this.logger.debug('type : ', type);
      return await this.logRepository.find({
        relations: ['user', 'card'],
        where: (qb) => {
          qb.where('Log__card.type = :type', {
            type: type,
          })
            .andWhere('Log__user.cardId = Log__card.cardId')
            // .andWhere('type = :type', { type: 'checkIn' })
            .orderBy('Log__card.cardId', 'DESC');
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

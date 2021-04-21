import { Injectable } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Log } from './entities/log.entity';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async getLog(id: number): Promise<Log[]> {
    return await this.logRepository.find({ where: { cardId: id } });
  }
  async getAll(): Promise<Log[]> {
    return await this.logRepository.find();
  }
  async createLog(user: User, card: Card, type: string) {
    const log = new Log(user, card, type);
    await this.logRepository.save(log);
  }
}

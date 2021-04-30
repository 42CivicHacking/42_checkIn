import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CardRepository } from './card.repository';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<Card[]> {
    return await this.cardRepository.find({ where: { using: false } });
  }

  async createCard(
    adminId: number,
    start: number,
    end: number,
    type: number,
  ): Promise<void> {
    this.userService.checkIsAdmin(adminId);
    for (let i = start; i < end; i++) {
      const card = new Card(type);
      this.cardRepository.save(card);
    }
  }

  async validCheck(cardId: number) {
    const card = await this.cardRepository.findOne(cardId);
    if (card) return { using: card.getStatus() };
    return { using: true };
  }

  async getUsingInfo(): Promise<any> {
    const gaepo = (
      await this.cardRepository.find({
        where: { using: true, type: 0 },
      })
    ).length;
    const seocho = (
      await this.cardRepository.find({
        where: { using: true, type: 1 },
      })
    ).length;
    return { gaepo: gaepo, seocho: seocho };
  }
}

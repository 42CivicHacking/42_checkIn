import { Injectable } from '@nestjs/common';
import { CardRepository } from './card.repository';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}
  async getAll(): Promise<Card[]> {
    return await this.cardRepository.find({ where: { using: false } });
  }
  async createCard(start: number, end: number): Promise<void> {
    for (let i = start; i < end; i++) {
      const card = new Card();
      this.cardRepository.save(card);
    }
  }
  async getLog(id: number) {}
}

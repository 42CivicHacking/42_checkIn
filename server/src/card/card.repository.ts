import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  async useCard(id: number): Promise<Card> {
    try {
      const card = await this.findOne(id);
      if (!card) throw new NotFoundException();
      if (card.getStatus()) throw new BadRequestException();
      const usingCard = (
        await this.find({
          where: { using: true, type: card.getType() },
        })
      ).length;
      if (usingCard >= 150) throw new BadRequestException();
      card.useCard();
      await this.save(card);
      return card;
    } catch (e) {
      console.info(e);
      throw e;
    }
  }

  async returnCard(card: Card): Promise<void> {
    try {
      if (!card.getStatus()) throw new BadRequestException();
      card.returnCard();
      await this.save(card);
    } catch (e) {
      console.info(e);
      throw e;
    }
  }
}

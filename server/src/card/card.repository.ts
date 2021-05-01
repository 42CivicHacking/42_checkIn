import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MyLogger } from 'src/logger/logger.service';
import { EntityRepository, Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  constructor(private readonly logger: MyLogger) {
    super();
  }
  async useCard(id: number): Promise<Card> {
    this.logger.log('using Card Start');
    this.logger.log('cardId : ', id);
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
  }

  async returnCard(card: Card): Promise<void> {
    this.logger.log('returning Card Start');
    this.logger.log('cardId : ', card.getId());
    if (!card.getStatus()) throw new BadRequestException();
    card.returnCard();
    await this.save(card);
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getCard(id: number): Promise<Card> {
    const user = await this.findOne(id, { relations: ['card'] });
    if (!user) throw new NotFoundException();
    const card = user.getCard();
    if (!card) throw new BadRequestException();
    return card;
  }

  async setCard(id: number, card: Card): Promise<User> {
    const user = await this.findOne(id, { relations: ['card'] });
    if (!user) throw new NotFoundException();
    if (user.getCard()) throw new BadRequestException();
    user.cardSet(card);
    await this.save(user);
    return user;
  }

  async clearCard(id: number): Promise<User> {
    const user = await this.findOne(id, { relations: ['card'] });
    if (!user) throw new NotFoundException();
    const card = user.getCard();
    if (!card) throw new BadRequestException();
    user.cardSet(null);
    await this.save(user);
    return user;
  }
}

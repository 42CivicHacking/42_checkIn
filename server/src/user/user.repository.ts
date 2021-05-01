import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findWithCard(id: number): Promise<User> {
    try {
      const user = await this.findOne(id, { relations: ['card'] });
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      console.info(e);
      throw e;
    }
  }

  async getCard(id: number): Promise<Card> {
    try {
      const user = await this.findWithCard(id);
      const card = user.getCard();

      if (!card) throw new BadRequestException();
      return card;
    } catch (e) {
      console.info(e);
      throw e;
    }
  }

  async setCard(id: number, card: Card): Promise<User> {
    try {
      const user = await this.findWithCard(id);
      if (user.getCard()) throw new BadRequestException();
      user.cardSet(card);
      await this.save(user);
      return user;
    } catch (e) {
      console.info(e);
      throw e;
    }
  }

  async clearCard(id: number): Promise<User> {
    try {
      const user = await this.findWithCard(id);
      const card = user.getCard();
      if (!card) throw new BadRequestException();
      user.cardSet(null);
      await this.save(user);
      return user;
    } catch (e) {
      console.info(e);
      throw e;
    }
  }
}

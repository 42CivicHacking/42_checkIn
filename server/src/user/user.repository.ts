import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Card } from 'src/card/entities/card.entity';
import { MyLogger } from 'src/logger/logger.service';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // constructor(private readonly logger: MyLogger) {
  //   super();
  // }

  async findWithCard(id: number): Promise<User> {
    const user = await this.findOne(id, { relations: ['card'] });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getCard(id: number): Promise<Card> {
    const user = await this.findWithCard(id);
    const card = user.getCard();

    if (!card) throw new BadRequestException();
    return card;
  }

  async setCard(id: number, card: Card): Promise<User> {
    // this.logger.log('setting Card Start');
    // this.logger.log('_id, cardId : ', id, card.getId());
    const user = await this.findWithCard(id);
    if (user.getCard()) throw new BadRequestException();
    user.cardSet(card);
    await this.save(user);
    return user;
  }

  async clearCard(id: number): Promise<User> {
    // this.logger.log('clearing Card Start');
    // this.logger.log('_id : ', id);
    const user = await this.findWithCard(id);
    const card = user.getCard();
    if (!card) throw new BadRequestException();
    user.cardSet(null);
    await this.save(user);
    return user;
  }
}

import {
  BadRequestException,
  HttpService,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from 'src/logger/logger.service';
import { EntityRepository, Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  // constructor(private readonly logger: MyLogger) {
  //   super();
  // }
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async useCard(id: number): Promise<Card> {
    // this.logger.log('using Card Start');
    // this.logger.log('cardId : ', id);
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException();
    if (card.getStatus()) throw new BadRequestException();
    const usingCard = (
      await this.find({
        where: { using: true, type: card.getType() },
      })
    ).length;
    if (usingCard >= 145) {
      if (card.getType() === 0) {
        const id = this.configService.get('discord.gaepo.id');
        const pw = this.configService.get('discord.gaepo.pw');
        this.httpService.post(`https://discord.com/api/webhooks/${id}/${pw}`, {
          content: `${150 - usingCard}명 남았습니다`,
        });
      }
      if (card.getType() === 1) {
        const id = this.configService.get('discord.seocho.id');
        const pw = this.configService.get('discord.seocho.pw');
        this.httpService.post(`https://discord.com/api/webhooks/${id}/${pw}`, {
          content: `${150 - usingCard}명 남았습니다`,
        });
      }
    }
    if (usingCard >= 150) throw new BadRequestException();
    card.useCard();
    await this.save(card);
    return card;
  }

  async returnCard(card: Card): Promise<void> {
    // this.logger.log('returning Card Start');
    // this.logger.log('cardId : ', card.getId());
    if (!card.getStatus()) throw new BadRequestException();
    card.returnCard();
    await this.save(card);
  }
}

import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('api/card/')
export class CardController {
  constructor(private readonly cardServcie: CardService) {}
  @Get('all')
  async getAll() {
    return await this.cardServcie.getAll();
  }

  @Post('create/:type')
  async createCard(
    @Query('start') start: number,
    @Query('end') end: number,
    @Param('type') type: number,
  ) {
    console.log(start, end);
    return await this.cardServcie.createCard(start, end, type);
  }

  @Get('valid/:id')
  async validCheck(@Param('id') cardId: number) {
    return await this.cardServcie.validCheck(cardId);
  }
}

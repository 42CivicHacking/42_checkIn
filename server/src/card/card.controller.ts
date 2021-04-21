import { Controller, Get, Post, Query } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('api/card/')
export class CardController {
  constructor(private readonly cardServcie: CardService) {}
  @Get('all')
  async getAll() {
    return await this.cardServcie.getAll();
  }

  @Post('create')
  async createCard(@Query('start') start: number, @Query('end') end: number) {
    console.log(start, end);
    return await this.cardServcie.createCard(start, end);
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CardService } from './card.service';

@ApiTags('Card')
@Controller('api/card')
export class CardController {
  constructor(private readonly cardServcie: CardService) {}
  @Get('all')
  async getAll() {
    try {
      return await this.cardServcie.getAll();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/:type')
  async createCard(
    @Req() req: any,
    @Query('start') start: number,
    @Query('end') end: number,
    @Param('type') type: number,
  ) {
    try {
      return await this.cardServcie.createCard(req.user._id, start, end, type);
    } catch (e) {
      console.info(e);
      throw e;
    }
  }

  @Get('valid/:id')
  async validCheck(@Param('id') cardId: number) {
    try {
      return await this.cardServcie.validCheck(cardId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('using')
  async getUsingInfo() {
    try {
      return await this.cardServcie.getUsingInfo();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

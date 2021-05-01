import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { FtAuthGuard } from 'src/auth/ft-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { MyLogger } from 'src/logger/logger.service';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: MyLogger,
  ) {}

  @UseGuards(FtAuthGuard)
  @Get('login')
  async login() {}

  @UseGuards(FtAuthGuard)
  @Get('login/callback')
  async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      try {
        const token = await this.userService.login(req.user);
        res.cookie('w_auth', token);
        res.status(302).redirect('/submit');
      } catch (e) {
        this.logger.info(e);
        throw e;
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req() req: any) {
    try {
      return this.userService.status(req.user._id);
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkIn/:cardId')
  async checkIn(@Req() req: any, @Param('cardId') cardId: number) {
    try {
      return this.userService.checkIn(req.user._id, cardId);
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkOut')
  async checkOut(@Req() req: any) {
    try {
      return this.userService.checkOut(req.user._id);
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('forceCheckOut/:userId')
  async forceCheckOut(@Req() req: any, @Param('userId') userId: number) {
    try {
      return this.userService.forceCheckOut(req.user._id, userId);
    } catch (e) {
      this.logger.info(e);
      throw e;
    }
  }
}

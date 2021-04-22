import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from './user.service';
import { FtAuthGuard } from 'src/auth/ft-auth.guard';

@Controller('api/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FtAuthGuard)
  @Get('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const token = await this.userService.login(req.user);
    res.cookie('w_auth', token);
    return req.user.getName();
  }

  @UseGuards(FtAuthGuard)
  @Get('login/callback')
  async callback() {
    return 0;
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkIn/:cardId')
  async checkIn(@Req() req: any, @Param('cardId') cardId: number) {
    return this.userService.checkIn(req.user.userId, cardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkOut')
  async checkOut(@Req() req: any) {
    console.log(req.user.userId);
    return this.userService.checkOut(req.user.userId);
  }
}

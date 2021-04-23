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
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    console.log(req.user);
    const token = await this.userService.login(req.user);
    res.cookie('w_auth', token);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return req.user.getName();
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

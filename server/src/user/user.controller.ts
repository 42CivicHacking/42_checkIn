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
import { UserService } from './user.service';
import { FtAuthGuard } from 'src/auth/ft-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FtAuthGuard)
  @Get('login')
  async login() {}

  @UseGuards(FtAuthGuard)
  @Get('login/callback')
  async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      const token = await this.userService.login(req.user);
      res.cookie('w_auth', token);
      res.status(302).redirect('/submit');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req() req: any) {
    return this.userService.status(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkIn/:cardId')
  async checkIn(@Req() req: any, @Param('cardId') cardId: number) {
    return this.userService.checkIn(req.user.userId, cardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkOut')
  async checkOut(@Req() req: any) {
    return this.userService.checkOut(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('forceCheckOut/:userId')
  async forceCheckOut(@Req() req: any, @Param('userId') userId: number) {
    return this.userService.forceCheckOut(req.user.userId, userId);
  }
}

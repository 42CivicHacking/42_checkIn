import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('token/:token')
  async getToken(
    @Param('token') ftToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.appService.getToken(ftToken);
    res.cookie('w_auth', token);
  }
}

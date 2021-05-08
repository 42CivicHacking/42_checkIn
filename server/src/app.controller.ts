import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('token/:id')
  getToken(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    const token = this.appService.getToken(id);
    res.cookie('w_auth', token);
  }
}

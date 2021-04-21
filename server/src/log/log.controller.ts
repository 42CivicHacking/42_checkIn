import { Controller, Get, Param } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('api/log/')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('user/:login')
  async getUserLog(@Param('login') login: string) {
    return this.logService.getUserLog(login);
  }
  @Get('card/:id')
  async getCardLog(@Param('id') id: number) {
    return this.logService.getCardLog(id);
  }
  @Get('all')
  async getAll() {
    return this.logService.getAll();
  }
}

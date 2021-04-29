import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';

@ApiTags('Log')
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

  @Get('gaepo/:page')
  async getGaepoLog(@Param('page') page: number) {
    return this.logService.getCluster(0, page);
  }

  @Get('seocho/:page')
  async getSeochoLog(@Param('page') page: number) {
    return this.logService.getCluster(1, page);
  }
}

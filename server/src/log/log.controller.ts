import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';

@ApiTags('Log')
@Controller('api/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('user/:login')
  async getUserLog(@Param('login') login: string) {
    try {
      return this.logService.getUserLog(login);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('card/:id')
  async getCardLog(@Param('id') id: number) {
    try {
      return this.logService.getCardLog(id);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('all')
  async getAll() {
    try {
      return this.logService.getAll();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('gaepo/:page')
  async getGaepoLog(@Param('page') page: number) {
    try {
      return this.logService.getCluster(0, page);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  @Get('seocho/:page')
  async getSeochoLog(@Param('page') page: number) {
    try {
      return this.logService.getCluster(1, page);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

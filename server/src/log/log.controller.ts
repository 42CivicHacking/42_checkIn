import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MyLogger } from 'src/logger/logger.service';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { LogService } from './log.service';

@ApiTags('Log')
@Controller('api/log')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly logger: MyLogger,
  ) {}

  @Get('user/:login')
  async getUserLog(@Param('login') login: string, @Query('page') page: number) {
    return this.logService.getUserLog(login, page);
  }

  @Get('card/:id')
  async getCardLog(@Param('id') id: number, @Query('page') page: number) {
    return this.logService.getCardLog(id, page);
  }

  @Get('all')
  async getAll() {
    return this.logService.getAll();
  }

  @Get('gaepo')
  async getGaepoLog(@Query('page') page: number) {
    return this.logService.getCluster(0, page);
  }

  @Get('seocho')
  async getSeochoLog(@Query('page') page: number) {
    return this.logService.getCluster(1, page);
  }

  @Get('CheckIn/:type')
  async getCheckInUsers(@Param('type') type: number) {
    return this.logService.getCheckIn(type);
  }

  @Get('allCard/:type')
  async getAllCardLog(@Param('type') type: number) {
    return this.logService.getAllCard(type);
  }
}

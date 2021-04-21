import { Controller, Param } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('api/log/')
export class LogController {
  constructor(private readonly logService: LogService) {}

  async getLog(@Param() id: number) {
    return this.logService.getLog(id);
  }
  async getAll() {
    return this.logService.getAll();
  }
}

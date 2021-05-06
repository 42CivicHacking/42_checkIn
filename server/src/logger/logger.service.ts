import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dailyfile } from 'tracer';

@Injectable()
export class MyLogger implements LoggerService {
  constructor(private readonly configService: ConfigService) {}

  logger_info = dailyfile({
    root: './logs',
    allLogsFileName: 'info.42CheckIn',
    stackIndex: 1,
  });

  logger_log = dailyfile({
    root: './logs',
    allLogsFileName: 'log.42CheckIn',
    stackIndex: 1,
    level: 'trace',
  });

  logger_error = dailyfile({
    root: './logs',
    allLogsFileName: 'error.42CheckIn',
    stackIndex: 1,
  });

  logger_debug = dailyfile({
    root: './logs',
    allLogsFileName: 'debug.42CheckIn',
    stackIndex: 1,
    level: this.configService.get('log.debug') === true ? 'debug' : 'error',
  });

  log(...trace: any[]) {
    this.logger_log.trace(trace);
  }
  error(...trace: any[]) {
    this.logger_error.error(trace);
  }
  warn(...trace: any[]) {
    this.logger_log.warn(trace);
  }
  debug(...trace: any[]) {
    this.logger_debug.debug(trace);
  }
  info(...trace: any[]) {
    this.logger_info.info(trace);
  }
}

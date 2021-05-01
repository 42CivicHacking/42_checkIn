import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { dailyfile } from 'tracer';
const logger_info = dailyfile({
  root: './logs',
  allLogsFileName: 'info.42CheckIn',
});

const logger_log = dailyfile({
  root: './logs',
  allLogsFileName: 'log.42CheckIn',
});

const logger_error = dailyfile({
  root: './logs',
  allLogsFileName: 'error.42CheckIn',
});

@Injectable()
export class MyLogger implements LoggerService {
  log(...trace: any[]) {
    logger_log.log(trace);
  }
  error(...trace: any[]) {
    logger_error.error(trace);
  }
  warn(...trace: any[]) {
    logger_log.warn(trace);
  }
  bebug(...trace: any[]) {
    logger_log.debug(trace);
  }
  info(...trace: any[]) {
    logger_info.info(trace);
  }
}

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
  log(trace: string) {
    logger_log.log(trace);
  }
  error(trace: string) {
    logger_error.error(trace);
  }
  warn(trace: string) {
    logger_log.warn(trace);
  }
  bebug(trace: string) {
    logger_log.debug(trace);
  }
  info(trace: string) {
    logger_info.info(trace);
  }
}

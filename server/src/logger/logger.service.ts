import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { dailyfile } from 'tracer';
const logger = dailyfile({
  root: './logs',
  allLogsFileName: '42CheckIn',
});

export class MyLogger implements LoggerService {
  log(trace: string) {
    logger.log(trace);
  }
  error(trace: string) {
    logger.error(trace);
  }
  warn(trace: string) {
    logger.warn(trace);
  }
  bebug(trace: string) {
    logger.debug(trace);
  }
  info(trace: string) {
    logger.info(trace);
  }
}

import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { dailyfile } from 'tracer';
const logger = dailyfile({
  root: '.',
  allLogsFileName: '42CheckIn',
});

export class MyLogger implements LoggerService {
  log(message: string, trace: string) {
    logger.log(message, trace);
  }
  error(message: string, trace: string) {
    logger.error(message, trace);
  }
  warn(message: string, trace: string) {
    logger.warn(message, trace);
  }
  bebug(message: string, trace: string) {
    logger.debug(message, trace);
  }
}

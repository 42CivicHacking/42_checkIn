import { forwardRef, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from './log.repository';
import { UserModule } from 'src/user/user.module';
import { LoggerModule } from 'src/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/logging.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogRepository]),
    forwardRef(() => UserModule),
    LoggerModule,
  ],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}

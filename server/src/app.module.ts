import { HttpModule, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { LogModule } from './log/log.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TokenThrottlerGuard } from './token.guard';
import { WaitingController } from './waiting/waiting.controller';
import { WaitingModule } from './waiting/waiting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [join(__dirname, '/**/*.entity.js')],
        synchronize: true,
      }),
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: resolve(__dirname, '../../../client/build'),
    // }),
    TerminusModule,
    UserModule,
    AuthModule,
    CardModule,
    LogModule,
    HealthModule,
    LoggerModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    WaitingModule,
    HttpModule,
  ],
  controllers: [AppController, HealthController, WaitingController],
  providers: [
    AppService,
    Logger,
    { provide: APP_GUARD, useClass: TokenThrottlerGuard },
  ],
})
export class AppModule {}

import { forwardRef, Module } from '@nestjs/common';
import { WaitingService } from './waiting.service';
import { WaitingController } from './waiting.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingRepository } from './waiting.repository';
import { UserModule } from 'src/user/user.module';
import { CardModule } from 'src/card/card.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([WaitingRepository]),
    forwardRef(() => UserModule),
    CardModule,
    MailerModule,
  ],
  providers: [WaitingService],
  controllers: [WaitingController],
  exports: [WaitingService, TypeOrmModule],
})
export class WaitingModule {}

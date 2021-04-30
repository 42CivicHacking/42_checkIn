import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { CardService } from './card.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardRepository]),
    AuthModule,
    forwardRef(() => UserModule),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService, TypeOrmModule],
})
export class CardModule {}

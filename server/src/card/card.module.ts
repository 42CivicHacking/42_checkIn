import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { CardService } from './card.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService, TypeOrmModule],
})
export class CardModule {}

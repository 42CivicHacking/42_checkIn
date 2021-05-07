import { Module } from '@nestjs/common';
import { WaitingService } from './waiting.service';
import { WaitingController } from './waiting.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WaitingService],
  controllers: [WaitingController],
})
export class WaitingModule {}

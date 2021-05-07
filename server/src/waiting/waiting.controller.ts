import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WaitingService } from './waiting.service';

@Controller('api/waiting')
export class WaitingController {
  constructor(private readonly waitingService: WaitingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createWaiting(@Req() req: any) {
    // return this.waitingService.create(req.user._id);
  }
}

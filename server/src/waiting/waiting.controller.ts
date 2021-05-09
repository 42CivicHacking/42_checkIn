import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WaitingService } from './waiting.service';

@Controller('api/waiting')
export class WaitingController {
  constructor(private readonly waitingService: WaitingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:type')
  async createWaiting(
    @Req() req: any,
    @Param('type')
    type: number,
  ) {
    return this.waitingService.create(req.user._id, type);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel')
  async cancelWaiting(@Req() req: any) {
    return this.waitingService.cancel(req.user._id);
  }
}

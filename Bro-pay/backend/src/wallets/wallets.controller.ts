import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'))
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Get('balance')
  getBalance(@Request() req: any) {
    return this.walletsService.getBalance(req.user.userId);
  }
}

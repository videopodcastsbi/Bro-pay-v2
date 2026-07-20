import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';
import { TopUpDto } from './dto/topup.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallets')
@UseGuards(AuthGuard('jwt'))
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Get('balance')
  getBalance(@Request() req: any) {
    return this.walletsService.getBalance(req.user.userId);
  }

  @Post('topup')
  @HttpCode(HttpStatus.OK)
  topUp(@Request() req: any, @Body() dto: TopUpDto) {
    return this.walletsService.topUp(req.user.userId, dto.amount, dto.description);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  transfer(@Request() req: any, @Body() dto: TransferDto) {
    return this.walletsService.transfer(
      req.user.userId,
      dto.receiver,
      dto.amount,
      dto.description,
    );
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  withdraw(@Request() req: any, @Body() dto: WithdrawDto) {
    return this.walletsService.withdraw(
      req.user.userId,
      dto.amount,
      dto.description,
    );
  }
}

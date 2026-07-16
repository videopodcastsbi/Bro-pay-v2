import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('send')
  sendMoney(@Request() req: any, @Body() body: { email: string; amount: number; description?: string }) {
    return this.transactionsService.sendMoney(req.user.userId, body.email, body.amount, body.description);
  }

  @Get('history')
  getHistory(@Request() req: any) {
    return this.transactionsService.getHistory(req.user.userId);
  }
}

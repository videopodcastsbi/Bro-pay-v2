import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  getHistory(@Request() req: any) {
    return this.transactionsService.getHistory(req.user.userId);
  }
}

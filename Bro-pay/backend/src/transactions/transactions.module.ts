import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { WalletsModule } from '../wallets/wallets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [WalletsModule, UsersModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}

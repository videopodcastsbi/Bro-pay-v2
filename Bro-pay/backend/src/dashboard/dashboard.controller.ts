import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getDashboard(@Request() req: any) {
    const userId = req.user.userId;
    
    // Get balance
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const balance = wallet ? Number(wallet.balance) : 0;

    // Get transactions
    const txs = await this.prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'desc' }
    });

    let income = 0;
    let expense = 0;
    
    const formattedTxs = txs.map(tx => {
      let isIncome = false;
      if (tx.type === 'TOP_UP') isIncome = true;
      if (tx.type === 'TRANSFER_RECEIVED' && tx.receiverId === userId) isIncome = true;

      const amount = Number(tx.amount);

      if (isIncome) {
        income += amount;
      } else {
        expense += amount;
      }

      return {
        id: tx.id,
        name: tx.description || (isIncome ? 'Received Money' : 'Sent Money'),
        type: isIncome ? 'income' : 'expense',
        amount,
        date: tx.createdAt.toISOString(),
      };
    });

    return {
      success: true,
      message: 'Dashboard data retrieved',
      data: {
        balance: Number(balance),
        income,
        expense,
        transactions: formattedTxs,
      },
    };
  }
}

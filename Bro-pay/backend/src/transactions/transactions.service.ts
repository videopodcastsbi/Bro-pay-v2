import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private prisma: PrismaService) {}

  async getHistory(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, username: true, email: true } },
        receiver: { select: { id: true, name: true, username: true, email: true } },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    const formatted = transactions.map((tx) => {
      let isIncome = false;

      if (tx.type === 'TOP_UP' && tx.receiverId === userId) {
        isIncome = true;
      } else if (tx.type === 'TRANSFER_RECEIVED' && tx.receiverId === userId) {
        isIncome = true;
      } else if (tx.type === 'TRANSFER_SENT' && tx.senderId === userId) {
        isIncome = false;
      } else if (tx.type === 'WITHDRAW' && tx.senderId === userId) {
        isIncome = false;
      }

      const amount = Number(tx.amount);

      if (isIncome) {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      return {
        id: tx.id,
        type: tx.type,
        status: tx.status,
        amount,
        description: tx.description,
        reference: tx.reference,
        isIncome,
        sender: tx.sender,
        receiver: tx.receiver,
        createdAt: tx.createdAt,
      };
    });

    return {
      success: true,
      message: 'Transaction history retrieved',
      data: {
        summary: {
          totalIncome,
          totalExpense,
        },
        transactions: formatted,
      },
    };
  }
}

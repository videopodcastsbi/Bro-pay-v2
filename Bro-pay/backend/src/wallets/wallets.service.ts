import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return {
      balance: wallet.balance,
      currency: wallet.currency,
    };
  }

  // Helper method for internal use
  async addBalance(userId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });
  }

  async deductBalance(userId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
  }
}

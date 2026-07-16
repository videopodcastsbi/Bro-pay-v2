import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService,
    private usersService: UsersService,
  ) {}

  async sendMoney(senderId: string, receiverEmail: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const receiver = await this.usersService.findOneByEmail(receiverEmail);
    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }

    if (senderId === receiver.id) {
      throw new BadRequestException('Cannot send money to yourself');
    }

    const senderWallet = await this.walletsService.getBalance(senderId);
    if (senderWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Execute transfer in a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Deduct from sender
      await prisma.wallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: amount } },
      });

      // Add to receiver
      await prisma.wallet.update({
        where: { userId: receiver.id },
        data: { balance: { increment: amount } },
      });

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          type: 'TRANSFER',
          status: 'COMPLETED',
          description: description || 'P2P Transfer',
          senderId,
          receiverId: receiver.id,
        },
      });

      return transaction;
    });
  }

  async getHistory(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
      },
    });
  }
}

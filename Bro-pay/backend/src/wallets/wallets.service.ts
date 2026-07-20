import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name);

  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return {
      success: true,
      message: 'Balance retrieved successfully',
      data: {
        balance: Number(wallet.balance),
        currency: wallet.currency,
      },
    };
  }

  async topUp(userId: string, amount: number, description?: string) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Top-up amount must be greater than 0');
    }

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'TOP_UP',
          status: 'SUCCESS',
          description: description || 'Top Up',
          receiverId: userId,
          reference: `TU-${Date.now()}`,
        },
      });

      return {
        success: true,
        message: 'Top-up successful',
        data: {
          transactionId: transaction.id,
          amount: Number(transaction.amount),
          newBalance: Number(updatedWallet.balance),
          reference: transaction.reference,
        },
      };
    });
  }

  async transfer(
    senderId: string,
    receiverIdentifier: string,
    amount: number,
    description?: string,
  ) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    // Find receiver by email or username
    const receiver = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: receiverIdentifier.toLowerCase() },
          { username: receiverIdentifier },
        ],
      },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (senderId === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    const senderWallet = await this.prisma.wallet.findUnique({
      where: { userId: senderId },
    });

    if (!senderWallet) {
      throw new NotFoundException('Sender wallet not found');
    }

    if (Number(senderWallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const receiverWallet = await this.prisma.wallet.findUnique({
      where: { userId: receiver.id },
    });

    if (!receiverWallet) {
      throw new NotFoundException('Receiver wallet not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Deduct sender balance
      const updatedSenderWallet = await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: amount } },
      });

      // Add receiver balance
      await tx.wallet.update({
        where: { userId: receiver.id },
        data: { balance: { increment: amount } },
      });

      const reference = `TR-${Date.now()}`;

      // Create sent transaction record for sender
      const sentTx = await tx.transaction.create({
        data: {
          amount,
          type: 'TRANSFER_SENT',
          status: 'SUCCESS',
          description: description || `Transfer to ${receiver.username}`,
          senderId,
          receiverId: receiver.id,
          reference,
        },
      });

      // Create received transaction record for receiver
      await tx.transaction.create({
        data: {
          amount,
          type: 'TRANSFER_RECEIVED',
          status: 'SUCCESS',
          description: description || `Received from sender`,
          senderId,
          receiverId: receiver.id,
          reference,
        },
      });

      return {
        success: true,
        message: 'Transfer successful',
        data: {
          transactionId: sentTx.id,
          amount: Number(sentTx.amount),
          receiver: {
            username: receiver.username,
            name: receiver.name,
          },
          newBalance: Number(updatedSenderWallet.balance),
          reference,
        },
      };
    });
  }

  async withdraw(userId: string, amount: number, description?: string) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Withdraw amount must be greater than 0');
    }

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'WITHDRAW',
          status: 'SUCCESS',
          description: description || 'Withdraw',
          senderId: userId,
          reference: `WD-${Date.now()}`,
        },
      });

      return {
        success: true,
        message: 'Withdrawal successful',
        data: {
          transactionId: transaction.id,
          amount: Number(transaction.amount),
          newBalance: Number(updatedWallet.balance),
          reference: transaction.reference,
        },
      };
    });
  }
}

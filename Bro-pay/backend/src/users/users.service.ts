import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmailOrUsername(identifier: string) {
    const lower = identifier.toLowerCase();
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: lower }, { username: identifier }],
      },
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        wallet: {
          select: {
            balance: true,
            currency: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getWallet(userId: string) {
    return this.prisma.wallet.findUnique({ where: { userId } });
  }

  async create(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        wallet: {
          create: {
            balance: 0,
            currency: 'IDR',
          },
        },
      },
      include: {
        wallet: true,
      },
    });
  }
}

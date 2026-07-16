import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput) {
    // When creating a user, also create an empty wallet for them
    return this.prisma.user.create({
      data: {
        ...data,
        wallet: {
          create: {
            balance: 0.0,
            currency: 'USD',
          },
        },
      },
      include: {
        wallet: true,
      },
    });
  }
}

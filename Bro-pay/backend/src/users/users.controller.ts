import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.getProfile(req.user.userId);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        balance: Number(user.wallet?.balance ?? 0),
        currency: user.wallet?.currency ?? 'IDR',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

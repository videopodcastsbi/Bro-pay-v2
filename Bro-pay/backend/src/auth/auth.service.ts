import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, username, password } = dto;

    // Check duplicate email
    const existingEmail = await this.usersService.findOneByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    // Check duplicate username
    const existingUsername = await this.usersService.findOneByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = await this.usersService.create({
        name,
        email,
        username,
        password: hashedPassword,
      });

      return {
        success: true,
        message: 'Registration successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          balance: Number(user.wallet?.balance ?? 0),
        },
      };
    } catch (error) {
      this.logger.error('Register error:', error?.message);
      // Handle SQLite unique constraint errors that slipped through
      if (
        error?.message?.includes('Unique constraint') ||
        error?.code === 'P2002'
      ) {
        const field = error?.meta?.target?.includes('email')
          ? 'email'
          : 'username';
        throw new ConflictException(`${field} is already taken`);
      }
      throw new InternalServerErrorException(
        'Registration failed. Please try again.',
      );
    }
  }

  async login(dto: LoginDto) {
    const { email: identifier, password } = dto;

    // Support login via email or username
    let user = await this.usersService.findOneByEmail(identifier.toLowerCase());
    if (!user) {
      user = await this.usersService.findOneByUsername(identifier);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Get wallet balance
    const wallet = await this.usersService.getWallet(user.id);

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          balance: Number(wallet?.balance ?? 0),
        },
      },
    };
  }
}

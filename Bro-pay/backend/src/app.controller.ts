import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  register(@Body() body: any) {
    return this.appService.register(body);
  }

  @Post('auth/login')
  login(@Body() body: any) {
    return this.appService.login(body);
  }

  @Get('dashboard')
  getDashboard() {
    return this.appService.getDashboard();
  }

  @Post('transactions')
  createTransaction(@Body() body: any) {
    return this.appService.createTransaction(body);
  }
}

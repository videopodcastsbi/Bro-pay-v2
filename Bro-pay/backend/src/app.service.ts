import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [
    { name: 'John Doe', email: 'bro@example.com', password: 'password' },
  ];

  private balance = 12450.00;
  private totalIncome = 4850.00;
  private totalExpense = 1240.50;

  private transactions = [
    { id: 1, name: 'Netflix Subscription', type: 'expense', amount: 15.99, date: 'Today, 10:00 AM' },
    { id: 2, name: 'Salary Deposit', type: 'income', amount: 4500.00, date: 'Yesterday, 09:00 AM' },
    { id: 3, name: 'Coffee Shop', type: 'expense', amount: 4.50, date: 'May 10, 08:30 AM' },
    { id: 4, name: 'Freelance Payment', type: 'income', amount: 350.00, date: 'May 09, 02:15 PM' },
  ];

  getHello(): string {
    return 'Bro Pay API is running!';
  }

  register(body: any) {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }
    const exists = this.users.find(u => u.email === email);
    if (exists) {
      throw new BadRequestException('User already exists');
    }
    const newUser = { name, email, password };
    this.users.push(newUser);
    return { success: true, message: 'User registered successfully', user: { name, email } };
  }

  login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      success: true,
      message: 'Login successful',
      user: { name: user.name, email: user.email },
      token: 'mock-jwt-token-bro-pay',
    };
  }

  getDashboard() {
    return {
      balance: this.balance,
      income: this.totalIncome,
      expense: this.totalExpense,
      transactions: this.transactions,
    };
  }

  createTransaction(body: any) {
    const { name, type, amount } = body;
    if (!name || !type || !amount) {
      throw new BadRequestException('Transaction name, type, and amount are required');
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const dateStr = 'Just now';
    const newId = this.transactions.length + 1;
    const newTx = {
      id: newId,
      name,
      type,
      amount: parsedAmount,
      date: dateStr,
    };

    this.transactions.unshift(newTx); // Add to beginning

    if (type === 'income') {
      this.balance += parsedAmount;
      this.totalIncome += parsedAmount;
    } else {
      this.balance -= parsedAmount;
      this.totalExpense += parsedAmount;
    }

    return { success: true, transaction: newTx, balance: this.balance };
  }
}

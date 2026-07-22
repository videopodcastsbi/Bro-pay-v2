import 'package:flutter_test/flutter_test.dart';
import 'package:bro_pay_mobile/providers/wallet_provider.dart';

void main() {
  group('WalletProvider Logic Tests', () {
    late WalletProvider wallet;

    setUp(() {
      wallet = WalletProvider();
    });

    test('Initial balance should be 0', () {
      expect(wallet.balance, 0.0);
      expect(wallet.income, 0.0);
      expect(wallet.expense, 0.0);
      expect(wallet.transactions.length, 0);
    });

    test('Top Up increases balance and income', () {
      bool success = wallet.topUp(100.0, 'Bank Deposit');
      
      expect(success, true);
      expect(wallet.balance, 100.0);
      expect(wallet.income, 100.0);
      expect(wallet.expense, 0.0);
      expect(wallet.transactions.length, 1);
      expect(wallet.transactions.first.type, 'income');
      expect(wallet.transactions.first.category, 'Top Up');
      expect(wallet.transactions.first.amount, 100.0);
    });

    test('Cannot withdraw if balance is insufficient', () {
      wallet.topUp(50.0, 'Bank Deposit');
      
      bool success = wallet.withdraw(100.0, 'ATM');
      
      expect(success, false);
      expect(wallet.balance, 50.0); // unchanged
      expect(wallet.expense, 0.0);
    });

    test('Withdraw decreases balance and increases expense', () {
      wallet.topUp(100.0, 'Bank Deposit');
      
      bool success = wallet.withdraw(40.0, 'ATM');
      
      expect(success, true);
      expect(wallet.balance, 60.0);
      expect(wallet.expense, 40.0);
      expect(wallet.income, 100.0);
      expect(wallet.transactions.length, 2);
      expect(wallet.transactions.first.category, 'Withdraw');
    });

    test('Transfer decreases balance and increases expense', () {
      wallet.topUp(200.0, 'Bank Deposit');
      
      bool success = wallet.transfer(50.0, 'John Doe');
      
      expect(success, true);
      expect(wallet.balance, 150.0);
      expect(wallet.expense, 50.0);
      expect(wallet.transactions.length, 2);
      expect(wallet.transactions.first.category, 'Transfer');
      expect(wallet.transactions.first.name, 'John Doe');
    });
    
    test('Total Balance = Income - Expenses', () {
      wallet.topUp(500.0, 'Salary');
      wallet.receive(200.0, 'Jane Doe');
      
      wallet.transfer(100.0, 'Alice');
      wallet.withdraw(50.0, 'ATM');
      
      // Income = 500 + 200 = 700
      // Expenses = 100 + 50 = 150
      // Balance = 700 - 150 = 550
      
      expect(wallet.income, 700.0);
      expect(wallet.expense, 150.0);
      expect(wallet.balance, 550.0);
    });
  });
}

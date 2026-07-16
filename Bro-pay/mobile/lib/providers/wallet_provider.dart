import 'package:flutter/foundation.dart';

class Transaction {
  final String id;
  final String type; // 'income' or 'expense'
  final String category; // 'Top Up', 'Transfer', 'Receive', 'Withdraw'
  final String name;
  final double amount;
  final DateTime date;

  Transaction({
    required this.id,
    required this.type,
    required this.category,
    required this.name,
    required this.amount,
    required this.date,
  });
}

class WalletProvider with ChangeNotifier {
  double _balance = 0.0;
  double _income = 0.0;
  double _expense = 0.0;
  final List<Transaction> _transactions = [];

  double get balance => _balance;
  double get income => _income;
  double get expense => _expense;
  List<Transaction> get transactions => [..._transactions].reversed.toList();

  bool topUp(double amount, String name) {
    if (amount <= 0) return false;
    _income += amount;
    _balance += amount;
    _addTransaction('income', 'Top Up', name, amount);
    return true;
  }

  bool transfer(double amount, String recipientName) {
    if (amount <= 0 || _balance < amount) return false;
    _expense += amount;
    _balance -= amount;
    _addTransaction('expense', 'Transfer', recipientName, amount);
    return true;
  }

  bool withdraw(double amount, String name) {
    if (amount <= 0 || _balance < amount) return false;
    _expense += amount;
    _balance -= amount;
    _addTransaction('expense', 'Withdraw', name, amount);
    return true;
  }

  bool receive(double amount, String senderName) {
    if (amount <= 0) return false;
    _income += amount;
    _balance += amount;
    _addTransaction('income', 'Receive', senderName, amount);
    return true;
  }

  void _addTransaction(String type, String category, String name, double amount) {
    _transactions.add(
      Transaction(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: type,
        category: category,
        name: name,
        amount: amount,
        date: DateTime.now(),
      ),
    );
    notifyListeners();
  }
}

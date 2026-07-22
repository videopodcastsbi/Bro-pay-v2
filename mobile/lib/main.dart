import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/wallet_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/top_up_screen.dart';
import 'screens/transfer_screen.dart';
import 'screens/withdraw_screen.dart';
import 'screens/transaction_history_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WalletProvider()),
      ],
      child: const BroPayApp(),
    ),
  );
}

class BroPayApp extends StatelessWidget {
  const BroPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bro Pay',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0C10),
        primaryColor: const Color(0xFF66FCF1),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF66FCF1), // Neon Cyan
          secondary: Color(0xFF8A2BE2), // Neon Purple
          surface: Color(0xFF1F2833), // Dark Gray Panel
          onPrimary: Colors.black,
          onSecondary: Colors.white,
          onSurface: Colors.white,
        ),
        textTheme: ThemeData.dark().textTheme.apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1F2833).withOpacity(0.4),
          labelStyle: const TextStyle(color: Color(0xFFC5C6C7)),
          hintStyle: const TextStyle(color: Color(0xFF45A29E)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF66FCF1), width: 1.5),
          ),
        ),
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/topup': (context) => const TopUpScreen(),
        '/transfer': (context) => const TransferScreen(),
        '/withdraw': (context) => const WithdrawScreen(),
        '/history': (context) => const TransactionHistoryScreen(),
        '/profile': (context) => const ProfileScreen(),
      },
    );
  }
}

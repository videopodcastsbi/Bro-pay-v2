const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  body?: any;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers = {}, ...rest } = options;
  
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data as T;
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      balance: number;
    };
  };
}

export interface AuthRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    username: string;
    balance: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    balance: number;
    income: number;
    expense: number;
    transactions: {
      id: string;
      name: string;
      type: string;
      amount: number;
      date: string;
    }[];
  };
}

export interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: {
    balance: number;
    currency: string;
  };
}

export interface TopUpResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    amount: number;
    newBalance: number;
    reference: string;
  };
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    amount: number;
    receiver: { username: string; name: string };
    newBalance: number;
    reference: string;
  };
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    summary: { totalIncome: number; totalExpense: number };
    transactions: {
      id: string;
      type: string;
      status: string;
      amount: number;
      description: string;
      reference: string;
      isIncome: boolean;
      sender: { id: string; name: string; username: string; email: string };
      receiver: { id: string; name: string; username: string; email: string };
      createdAt: string;
    }[];
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    username: string;
    balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request<AuthLoginResponse>('/auth/login', { method: 'POST', body }),
    register: (body: { name: string; email: string; username: string; password: string }) =>
      request<AuthRegisterResponse>('/auth/register', { method: 'POST', body }),
  },
  dashboard: {
    get: () => request<DashboardResponse>('/dashboard'),
  },
  wallets: {
    balance: () => request<WalletBalanceResponse>('/wallets/balance'),
    topup: (body: { amount: number; description?: string }) =>
      request<TopUpResponse>('/wallets/topup', { method: 'POST', body }),
    transfer: (body: { receiver: string; amount: number; description?: string }) =>
      request<TransferResponse>('/wallets/transfer', { method: 'POST', body }),
    withdraw: (body: { amount: number; description?: string }) =>
      request<TopUpResponse>('/wallets/withdraw', { method: 'POST', body }),
  },
  transactions: {
    list: () => request<TransactionsResponse>('/transactions'),
  },
  users: {
    me: () => request<ProfileResponse>('/users/me'),
  },
};

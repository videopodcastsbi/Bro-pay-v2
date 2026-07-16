const API_BASE = 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  body?: any;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers = {}, ...rest } = options;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
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

export const api = {
  auth: {
    login: (body: { email: string; password: string }) => 
      request<{ success: boolean; message: string; user: any; token: string }>('/auth/login', { method: 'POST', body }),
    register: (body: { name: string; email: string; password: string }) =>
      request<{ success: boolean; message: string; user: any }>('/auth/register', { method: 'POST', body }),
  },
  dashboard: {
    get: () => request<{ balance: number; income: number; expense: number; transactions: any[] }>('/dashboard'),
  },
  transactions: {
    create: (body: { name: string; type: string; amount: number }) =>
      request<{ success: boolean; transaction: any; balance: number }>('/transactions', { method: 'POST', body }),
  },
};

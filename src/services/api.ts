// const API_BASE_URL =  'http://localhost:5020/api';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5020/api' 
  : 'https://expensetracker-f2q2.onrender.com/api'; // Add /api at the end

export interface Budget {
  _id: string;
  user: string;
  category: string;
  limit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  _id?: string;
  id?: string;
  item_name: string;
  category: string;
  price: number;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ExpenseStats {
  today: { total: number; count: number };
  monthly: { total: number; count: number };
  dailyAverage: number;
  total: { total: number; count: number };
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('url' , url);
    
    const config: RequestInit = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Get all expenses
  async getExpenses(): Promise<Expense[]> {
    return this.request<Expense[]>('/expenses');
  }

  // Get expenses by date range
  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return this.request<Expense[]>(`/expenses/range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get single expense
  async getExpense(id: string): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`);
  }

  // Create new expense
  async createExpense(expense: Omit<Expense, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // Update expense
  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  // Delete expense
  async deleteExpense(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Get expense statistics
  async getExpenseStats(): Promise<ExpenseStats> {
    return this.request<ExpenseStats>('/expenses/stats/summary');
  }

  // Get all budgets for the current user
  async getBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>('/budgets');
  }

  // Set or Update a budget limit for a category
  async setBudget(category: string, limit: number): Promise<Budget> {
    return this.request<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify({ category, limit }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request<{ status: string; message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
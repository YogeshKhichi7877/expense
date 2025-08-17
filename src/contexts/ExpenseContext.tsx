import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Expense {
  _id?: string;
  id?: string;
  userId?: string;
  item_name: string;
  category: string;
  price: number;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null
};

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        error: null
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => 
          (expense._id || expense.id) !== action.payload
        ),
        error: null
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          (expense._id || expense.id) === (action.payload._id || action.payload.id) 
            ? action.payload 
            : expense
        ),
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
  actions: {
    loadExpenses: () => Promise<void>;
    addExpense: (expense: Omit<Expense, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
  };
} | null>(null);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const actions = {
    loadExpenses: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const expenses = await apiService.getExpenses();
        dispatch({ type: 'SET_EXPENSES', payload: expenses });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      }
    },

    addExpense: async (expense: Omit<Expense, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newExpense = await apiService.createExpense(expense);
        dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      }
    },

    updateExpense: async (id: string, expense: Partial<Expense>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const updatedExpense = await apiService.updateExpense(id, expense);
        dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      }
    },

    deleteExpense: async (id: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await apiService.deleteExpense(id);
        dispatch({ type: 'DELETE_EXPENSE', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO string
  isFixed: boolean; // Recorrente/Fixo
  installment?: {
    current: number;
    total: number;
  };
}

export interface User {
  email: string;
  name: string;
  password: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  projectedSavings: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
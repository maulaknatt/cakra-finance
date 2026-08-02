import { Role, EventStatus, TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";

// Auth Session Payload
export interface UserSession {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
}

// Response Wrapper DTO
export interface ActionResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Summary Metrics DTO for Dashboard
export interface DashboardSummary {
  totalEvents: number;
  totalIncome: number;
  totalExpense: number;
  overallBalance: number;
  totalTransactions: number;
}

// Monthly Chart Data DTO
export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// Category Breakdown DTO
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

// Filter Query Parameters DTO
export interface TransactionFilterParams {
  eventId?: string;
  month?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  incomeCategory?: IncomeCategory;
  expenseCategory?: ExpenseCategory;
  search?: string;
  page?: number;
  limit?: number;
}

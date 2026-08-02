import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from "@/constants";

export interface DashboardAnalyticsData {
  summary: {
    totalEvents: number;
    totalIncome: number;
    totalExpense: number;
    overallBalance: number;
    totalTransactions: number;
  };
  monthlyData: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
  incomeCategories: {
    name: string;
    value: number;
  }[];
  expenseCategories: {
    name: string;
    value: number;
  }[];
  recentTransactions: {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    eventTitle: string;
    creatorName: string;
  }[];
}

export class AnalyticsService {
  static async getDashboardAnalytics(year: number = new Date().getFullYear()): Promise<DashboardAnalyticsData> {
    // 1. Total Events count
    const totalEvents = await prisma.event.count();

    // 2. All Transactions for the year
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59),
        },
      },
      include: {
        event: { select: { title: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    // Monthly data initialization (Jan - Dec)
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const monthlyMap = monthNames.map((m) => ({
      month: m,
      income: 0,
      expense: 0,
      balance: 0,
    }));

    // Category accumulators
    const incomeCatMap: Record<string, number> = {};
    const expenseCatMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount);
      const monthIdx = new Date(tx.date).getMonth();

      if (tx.type === TransactionType.INCOME) {
        totalIncome += amt;
        monthlyMap[monthIdx].income += amt;

        const catLabel = tx.incomeCategory ? INCOME_CATEGORY_LABELS[tx.incomeCategory] : "Lainnya";
        incomeCatMap[catLabel] = (incomeCatMap[catLabel] || 0) + amt;
      } else {
        totalExpense += amt;
        monthlyMap[monthIdx].expense += amt;

        const catLabel = tx.expenseCategory ? EXPENSE_CATEGORY_LABELS[tx.expenseCategory] : "Lainnya";
        expenseCatMap[catLabel] = (expenseCatMap[catLabel] || 0) + amt;
      }
    });

    // Calculate monthly running balance
    let runningBalance = 0;
    monthlyMap.forEach((m) => {
      runningBalance += m.income - m.expense;
      m.balance = runningBalance;
    });

    const incomeCategories = Object.entries(incomeCatMap).map(([name, value]) => ({
      name,
      value,
    }));

    const expenseCategories = Object.entries(expenseCatMap).map(([name, value]) => ({
      name,
      value,
    }));

    const recentTransactions = transactions.slice(0, 5).map((tx) => ({
      id: tx.id,
      description: tx.description,
      amount: Number(tx.amount),
      type: tx.type,
      date: tx.date,
      eventTitle: tx.event.title,
      creatorName: tx.createdBy.name,
    }));

    return {
      summary: {
        totalEvents,
        totalIncome,
        totalExpense,
        overallBalance: totalIncome - totalExpense,
        totalTransactions: transactions.length,
      },
      monthlyData: monthlyMap,
      incomeCategories,
      expenseCategories,
      recentTransactions,
    };
  }
}

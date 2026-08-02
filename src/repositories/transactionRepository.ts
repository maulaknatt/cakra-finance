import { prisma } from "@/lib/prisma";
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory, Prisma } from "@prisma/client";

export interface TransactionWithRelations extends Omit<Transaction, "amount"> {
  amount: number;
  event: {
    id: string;
    title: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }[];
}

export interface TransactionFilterQuery {
  eventId?: string;
  type?: TransactionType;
  incomeCategory?: IncomeCategory;
  expenseCategory?: ExpenseCategory;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  month?: number;
  year?: number;
}

export class TransactionRepository {
  static async findAll(filter: TransactionFilterQuery = {}): Promise<TransactionWithRelations[]> {
    const where: Prisma.TransactionWhereInput = {};

    if (filter.eventId) {
      where.eventId = filter.eventId;
    }

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.incomeCategory) {
      where.incomeCategory = filter.incomeCategory;
    }

    if (filter.expenseCategory) {
      where.expenseCategory = filter.expenseCategory;
    }

    if (filter.startDate || filter.endDate) {
      where.date = {
        ...(filter.startDate && { gte: filter.startDate }),
        ...(filter.endDate && { lte: filter.endDate }),
      };
    }

    if (filter.search) {
      where.OR = [
        { description: { contains: filter.search } },
        { event: { title: { contains: filter.search } } },
        { createdBy: { name: { contains: filter.search } } },
      ];
    }

    // Month & Year Filter
    if (filter.month && filter.year) {
      const startOfMonth = new Date(filter.year, filter.month - 1, 1);
      const endOfMonth = new Date(filter.year, filter.month, 0, 23, 59, 59);
      where.date = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    } else if (filter.year) {
      const startOfYear = new Date(filter.year, 0, 1);
      const endOfYear = new Date(filter.year, 11, 31, 23, 59, 59);
      where.date = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    const items = await prisma.transaction.findMany({
      where,
      include: {
        event: {
          select: { id: true, title: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        attachments: true,
      },
      orderBy: { date: "desc" },
    });

    return items.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    })) as TransactionWithRelations[];
  }

  static async findById(id: string): Promise<TransactionWithRelations | null> {
    const tx = await prisma.transaction.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, title: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        attachments: true,
      },
    });

    if (!tx) return null;

    return {
      ...tx,
      amount: Number(tx.amount),
    } as TransactionWithRelations;
  }

  static async create(data: {
    eventId: string;
    type: TransactionType;
    incomeCategory?: IncomeCategory;
    expenseCategory?: ExpenseCategory;
    amount: number;
    date: Date;
    description: string;
    createdById: string;
    attachments?: {
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }[];
  }): Promise<TransactionWithRelations> {
    const created = await prisma.transaction.create({
      data: {
        eventId: data.eventId,
        type: data.type,
        incomeCategory: data.type === "INCOME" ? data.incomeCategory : undefined,
        expenseCategory: data.type === "EXPENSE" ? data.expenseCategory : undefined,
        amount: new Prisma.Decimal(data.amount),
        date: data.date,
        description: data.description,
        createdById: data.createdById,
        attachments: data.attachments
          ? {
              create: data.attachments,
            }
          : undefined,
      },
      include: {
        event: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        attachments: true,
      },
    });

    return {
      ...created,
      amount: Number(created.amount),
    } as TransactionWithRelations;
  }

  static async update(
    id: string,
    data: {
      eventId?: string;
      type?: TransactionType;
      incomeCategory?: IncomeCategory | null;
      expenseCategory?: ExpenseCategory | null;
      amount?: number;
      date?: Date;
      description?: string;
    }
  ): Promise<TransactionWithRelations> {
    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(data.eventId && { eventId: data.eventId }),
        ...(data.type && { type: data.type }),
        incomeCategory: data.type === "INCOME" ? (data.incomeCategory || null) : null,
        expenseCategory: data.type === "EXPENSE" ? (data.expenseCategory || null) : null,
        ...(data.amount !== undefined && { amount: new Prisma.Decimal(data.amount) }),
        ...(data.date && { date: data.date }),
        ...(data.description && { description: data.description }),
      },
      include: {
        event: { select: { id: true, title: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        attachments: true,
      },
    });

    return {
      ...updated,
      amount: Number(updated.amount),
    } as TransactionWithRelations;
  }

  static async delete(id: string): Promise<Transaction> {
    return prisma.transaction.delete({
      where: { id },
    });
  }
}

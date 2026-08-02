import { prisma } from "@/lib/prisma";
import { Event, EventStatus, TransactionType } from "@prisma/client";

export interface EventWithSummary extends Event {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export class EventRepository {
  static async findAll(search?: string, status?: EventStatus): Promise<EventWithSummary[]> {
    const events = await prisma.event.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { picName: { contains: search } },
          ],
        }),
        ...(status && { status }),
      },
      include: {
        transactions: {
          select: {
            type: true,
            amount: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return events.map((event) => {
      let totalIncome = 0;
      let totalExpense = 0;

      const plainTransactions = event.transactions.map((tx: { type: TransactionType; amount: unknown }) => ({
        ...tx,
        amount: Number(tx.amount),
      }));

      plainTransactions.forEach((tx) => {
        const val = tx.amount;
        if (tx.type === TransactionType.INCOME) {
          totalIncome += val;
        } else {
          totalExpense += val;
        }
      });

      const { transactions, ...restEvent } = event;

      return {
        ...restEvent,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: plainTransactions.length,
      };
    });
  }

  static async findById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        transactions: {
          include: {
            createdBy: { select: { name: true } },
            attachments: true,
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!event) return null;

    let totalIncome = 0;
    let totalExpense = 0;

    const plainTransactions = event.transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    }));

    plainTransactions.forEach((tx) => {
      const val = tx.amount;
      if (tx.type === TransactionType.INCOME) {
        totalIncome += val;
      } else {
        totalExpense += val;
      }
    });

    return {
      ...event,
      transactions: plainTransactions,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  static async create(data: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    status: EventStatus;
    picName: string;
    createdById: string;
  }): Promise<Event> {
    return prisma.event.create({
      data,
    });
  }

  static async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      status?: EventStatus;
      picName?: string;
      isActive?: boolean;
    }
  ): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<Event> {
    return prisma.event.delete({
      where: { id },
    });
  }
}

import { TransactionRepository } from "@/repositories/transactionRepository";
import { EventRepository } from "@/repositories/eventRepository";
import { getSession } from "@/lib/auth";
import { TransactionListClient } from "@/components/transactions/TransactionListClient";
import { TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    type?: TransactionType;
    eventId?: string;
    incomeCategory?: IncomeCategory;
    expenseCategory?: ExpenseCategory;
  }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  const transactions = await TransactionRepository.findAll({
    search: params.search,
    type: params.type,
    eventId: params.eventId,
    incomeCategory: params.incomeCategory,
    expenseCategory: params.expenseCategory,
  });

  const events = await EventRepository.findAll();

  const simpleEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
  }));

  return (
    <TransactionListClient
      transactions={transactions}
      eventsList={simpleEvents}
      userRole={session?.role || "KETUA"}
      initialSearch={params.search || ""}
      initialType={params.type || ""}
      initialEventId={params.eventId || ""}
    />
  );
}

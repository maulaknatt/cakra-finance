import { TransactionRepository } from "@/repositories/transactionRepository";
import { EventRepository } from "@/repositories/eventRepository";
import { getSession } from "@/lib/auth";
import { ReportViewClient } from "@/components/reports/ReportViewClient";

export default async function ReportsPage() {
  await getSession(); // ensure auth

  const transactions = await TransactionRepository.findAll();
  const events = await EventRepository.findAll();

  const simpleEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
  }));

  return <ReportViewClient transactions={transactions} eventsList={simpleEvents} />;
}

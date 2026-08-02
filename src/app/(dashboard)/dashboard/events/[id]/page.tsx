import { EventRepository } from "@/repositories/eventRepository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, TrendingUp, TrendingDown, Wallet, FileText, Paperclip } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { EVENT_STATUS_LABELS, INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from "@/constants";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await EventRepository.findById(id);

  if (!event) {
    notFound();
  }

  const statusConfig = EVENT_STATUS_LABELS[event.status];

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/events">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Event
          </Button>
        </Link>
      </div>

      {/* Main Event Info Banner */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Dibuat oleh: {event.createdBy.name}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {event.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {event.description || "Tidak ada deskripsi rinci untuk kegiatan ini."}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60 text-xs text-slate-600 dark:text-slate-400 min-w-[240px]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" />
              <span>PIC: <strong className="text-slate-900 dark:text-slate-100">{event.picName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span>
                {formatTanggal(event.startDate, "dd MMMM yyyy")} - {formatTanggal(event.endDate, "dd MMMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Metric Cards for Event */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Pemasukan Event
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatRupiah(event.totalIncome)}
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Pengeluaran Event
            </span>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatRupiah(event.totalExpense)}
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Saldo Bersih Event
            </span>
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-extrabold ${
              event.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatRupiah(event.balance)}
          </p>
        </Card>
      </div>

      {/* Transactions Table for this Event */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Histori Transaksi Keuangan Event
          </CardTitle>
          <span className="text-xs font-medium text-slate-500">
            {event.transactions.length} Catatan Transaksi
          </span>
        </CardHeader>
        <CardContent>
          {event.transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Belum ada transaksi tercatat untuk event kegiatan ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3">Input Oleh</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {event.transactions.map((tx: any) => {
                    const isIncome = tx.type === "INCOME";
                    const categoryLabel = isIncome
                      ? tx.incomeCategory
                        ? INCOME_CATEGORY_LABELS[tx.incomeCategory as keyof typeof INCOME_CATEGORY_LABELS]
                        : "-"
                      : tx.expenseCategory
                      ? EXPENSE_CATEGORY_LABELS[tx.expenseCategory as keyof typeof EXPENSE_CATEGORY_LABELS]
                      : "-";

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {formatTanggal(tx.date, "dd MMM yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={isIncome ? "income" : "expense"}>
                            {isIncome ? "Pemasukan" : "Pengeluaran"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {categoryLabel}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {tx.description}
                          {tx.attachments.length > 0 && (
                            <span className="ml-2 inline-flex items-center gap-0.5 text-xs text-emerald-600">
                              <Paperclip className="h-3 w-3" /> ({tx.attachments.length})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {tx.createdBy.name}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-extrabold whitespace-nowrap ${
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

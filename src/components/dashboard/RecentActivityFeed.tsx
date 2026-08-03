import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { TransactionType } from "@prisma/client";

interface RecentActivityFeedProps {
  transactions: {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    eventTitle: string;
    creatorName: string;
  }[];
}

export function RecentActivityFeed({ transactions }: RecentActivityFeedProps) {
  return (
    <Card className="cartoon-card font-sans">
      <CardHeader className="flex flex-row items-center justify-between border-b-[2.5px] border-slate-900 dark:border-slate-100 pb-4">
        <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-950 dark:text-white">
          <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Aktivitas Transaksi Terkini ⚡
        </CardTitle>
        <Link href="/dashboard/transactions">
          <Button variant="yellow" size="sm" className="font-extrabold gap-1">
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
            Belum ada aktivitas transaksi terbaru.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isIncome = tx.type === "INCOME";

              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border-[2px] border-slate-900 bg-white p-4 dark:border-slate-100 dark:bg-slate-950 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#f8fafc] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2px] border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] ${
                        isIncome
                          ? "bg-emerald-400 text-slate-950"
                          : "bg-rose-400 text-slate-950"
                      }`}
                    >
                      {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-slate-950 dark:text-white">
                        {tx.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-slate-600 dark:text-slate-400">
                        <span className="truncate max-w-[180px] text-emerald-700 dark:text-emerald-400">
                          {tx.eventTitle}
                        </span>
                        <span>•</span>
                        <span>{formatTanggal(tx.date, "dd MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t border-slate-900 sm:border-t-0 dark:border-slate-100">
                    <p
                      className={`text-sm font-black ${
                        isIncome ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">by {tx.creatorName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

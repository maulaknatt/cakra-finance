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
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Aktivitas Transaksi Terkini
        </CardTitle>
        <Link href="/dashboard/transactions">
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 gap-1">
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Belum ada aktivitas transaksi terbaru.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isIncome = tx.type === "INCOME";

              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                        {tx.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="truncate max-w-[180px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {tx.eventTitle}
                        </span>
                        <span>•</span>
                        <span>{formatTanggal(tx.date, "dd MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t border-slate-200/40 sm:border-t-0 dark:border-slate-800/40">
                    <p
                      className={`text-sm font-extrabold ${
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">by {tx.creatorName}</span>
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

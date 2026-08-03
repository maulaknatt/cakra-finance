import { CalendarDays, TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface DashboardMetricCardsProps {
  summary: {
    totalEvents: number;
    totalIncome: number;
    totalExpense: number;
    overallBalance: number;
    totalTransactions: number;
  };
}

export function DashboardMetricCards({ summary }: DashboardMetricCardsProps) {
  const metrics = [
    {
      title: "Saldo Kas Bersih",
      value: formatRupiah(summary.overallBalance),
      subtitle: "Total Kas Aktif",
      icon: Wallet,
      badge: "Utama",
      badgeVariant: "default" as const,
      cardBg: "bg-emerald-100 dark:bg-slate-900 border-emerald-500",
      iconBg: "bg-emerald-400 text-slate-950",
    },
    {
      title: "Total Pemasukan",
      value: formatRupiah(summary.totalIncome),
      subtitle: "Kas & Sponsor Masuk",
      icon: TrendingUp,
      badge: "Debit",
      badgeVariant: "income" as const,
      cardBg: "bg-cyan-100 dark:bg-slate-900 border-cyan-500",
      iconBg: "bg-cyan-400 text-slate-950",
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(summary.totalExpense),
      subtitle: "Biaya Operasional",
      icon: TrendingDown,
      badge: "Kredit",
      badgeVariant: "expense" as const,
      cardBg: "bg-rose-100 dark:bg-slate-900 border-rose-500",
      iconBg: "bg-rose-400 text-slate-950",
    },
    {
      title: "Total Event",
      value: `${summary.totalEvents} Kegiatan`,
      subtitle: "Program Kerja",
      icon: CalendarDays,
      badge: "Agenda",
      badgeVariant: "yellow" as const,
      cardBg: "bg-amber-100 dark:bg-slate-900 border-amber-500",
      iconBg: "bg-amber-400 text-slate-950",
    },
    {
      title: "Jumlah Transaksi",
      value: `${summary.totalTransactions} Catatan`,
      subtitle: "Entry Keuangan",
      icon: Receipt,
      badge: "Audit",
      badgeVariant: "cyan" as const,
      cardBg: "bg-violet-100 dark:bg-slate-900 border-violet-500",
      iconBg: "bg-violet-400 text-slate-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 font-sans">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card
            key={idx}
            className={`cartoon-card-hover p-4 ${m.cardBg}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {m.title}
                </span>
                <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white truncate">
                  {m.value}
                </p>
              </div>

              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2px] border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] ${m.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t-[2px] border-slate-900 dark:border-slate-100 pt-2.5 text-xs">
              <span className="font-extrabold text-slate-600 dark:text-slate-400">
                {m.subtitle}
              </span>
              <Badge variant={m.badgeVariant} className="text-[10px] px-2 py-0">
                {m.badge}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

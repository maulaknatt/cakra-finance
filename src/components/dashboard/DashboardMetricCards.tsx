import { CalendarDays, TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      title: "Saldo Keseluruhan",
      value: formatRupiah(summary.overallBalance),
      subtitle: "Total Kas Aktif",
      icon: Wallet,
      badge: "Utama",
      badgeColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
      accentGradient: "from-teal-500 to-emerald-600",
      iconBg: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/20 dark:text-teal-300",
    },
    {
      title: "Total Pemasukan",
      value: formatRupiah(summary.totalIncome),
      subtitle: "Kas & Sponsor Masuk",
      icon: TrendingUp,
      badge: "Debit",
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      accentGradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300",
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(summary.totalExpense),
      subtitle: "Biaya Operasional",
      icon: TrendingDown,
      badge: "Kredit",
      badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
      accentGradient: "from-rose-500 to-red-600",
      iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300",
    },
    {
      title: "Total Event",
      value: `${summary.totalEvents} Kegiatan`,
      subtitle: "Program Kerja",
      icon: CalendarDays,
      badge: "Agenda",
      badgeColor: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
      accentGradient: "from-sky-500 to-blue-600",
      iconBg: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300",
    },
    {
      title: "Jumlah Transaksi",
      value: `${summary.totalTransactions} Catatan`,
      subtitle: "Entry Keuangan",
      icon: Receipt,
      badge: "Audit",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
      accentGradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.accentGradient}`} />

            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {m.title}
                </span>
                <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {m.value}
                </p>
              </div>

              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${m.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800/80">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {m.subtitle}
              </span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${m.badgeColor}`}>
                {m.badge}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

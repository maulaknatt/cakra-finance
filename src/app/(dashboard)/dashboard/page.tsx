import { getSession } from "@/lib/auth";
import { AnalyticsService } from "@/services/analyticsService";
import { DashboardMetricCards } from "@/components/dashboard/DashboardMetricCards";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/constants";
import Link from "next/link";
import { Plus, FileSpreadsheet, Sparkles, Home } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const analytics = await AnalyticsService.getDashboardAnalytics();

  return (
    <div className="space-y-6 font-sans">
      {/* Cartoon Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-slate-900 bg-amber-300 p-6 sm:p-8 text-slate-950 shadow-[6px_6px_0px_0px_#0f172a] dark:bg-amber-400 dark:border-slate-100">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-slate-900 bg-white px-3.5 py-1 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              SISTEM KEUANGAN ORGANISASI KEPEMUDAAN
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Selamat Datang, {session?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-800 max-w-xl leading-relaxed">
              Anda masuk sebagai <strong className="bg-emerald-300 px-2 py-0.5 rounded-lg border-[1.5px] border-slate-900 text-slate-950">{ROLE_LABELS[session?.role || "KETUA"]}</strong>. Pantau kas, kegiatan event, dan cetak laporan keuangan organisasi dengan cepat & aman.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/">
              <Button size="sm" variant="outline" className="gap-1.5 font-extrabold text-xs">
                <Home className="h-4 w-4" /> Profil Welcome
              </Button>
            </Link>

            {(session?.role === "ADMIN" || session?.role === "BENDAHARA") && (
              <Link href="/dashboard/events">
                <Button size="sm" variant="default" className="gap-1.5 font-extrabold text-xs">
                  <Plus className="h-4 w-4" /> Event Baru
                </Button>
              </Link>
            )}

            {(session?.role === "ADMIN" || session?.role === "BENDAHARA") && (
              <Link href="/dashboard/transactions">
                <Button size="sm" variant="cyan" className="gap-1.5 font-extrabold text-xs">
                  <Plus className="h-4 w-4" /> Catat Transaksi
                </Button>
              </Link>
            )}

            <Link href="/dashboard/reports">
              <Button size="sm" variant="pink" className="gap-1.5 font-extrabold text-xs">
                <FileSpreadsheet className="h-4 w-4" /> Cetak Laporan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Financial Metric Summary Cards */}
      <DashboardMetricCards summary={analytics.summary} />

      {/* Visual Recharts Charts */}
      <FinancialCharts
        monthlyData={analytics.monthlyData}
        incomeCategories={analytics.incomeCategories}
        expenseCategories={analytics.expenseCategories}
      />

      {/* Recent Activity Feed */}
      <RecentActivityFeed transactions={analytics.recentTransactions} />
    </div>
  );
}

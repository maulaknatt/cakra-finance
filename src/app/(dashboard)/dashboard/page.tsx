import { getSession } from "@/lib/auth";
import { AnalyticsService } from "@/services/analyticsService";
import { DashboardMetricCards } from "@/components/dashboard/DashboardMetricCards";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/constants";
import Link from "next/link";
import { Plus, FileSpreadsheet, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const analytics = await AnalyticsService.getDashboardAnalytics();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Sistem Keuangan Organisasi Kepemudaan
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Selamat Datang, {session?.name}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Anda masuk sebagai <strong className="text-emerald-400">{ROLE_LABELS[session?.role || "KETUA"]}</strong>. Pantau saldo, event kegiatan, dan laporan keuangan organisasi dengan cepat dan aman.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {(session?.role === "ADMIN" || session?.role === "BENDAHARA") && (
              <Link href="/dashboard/events">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                  <Plus className="mr-1.5 h-4 w-4" /> Tambah Event
                </Button>
              </Link>
            )}

            {(session?.role === "ADMIN" || session?.role === "BENDAHARA") && (
              <Link href="/dashboard/transactions">
                <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                  <Plus className="mr-1.5 h-4 w-4" /> Catat Transaksi
                </Button>
              </Link>
            )}

            <Link href="/dashboard/reports">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Cetak Laporan
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

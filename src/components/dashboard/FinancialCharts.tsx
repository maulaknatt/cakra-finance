"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface FinancialChartsProps {
  monthlyData: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
  incomeCategories: {
    name: string;
    value: number;
  }[];
  expenseCategories: {
    name: string;
    value: number;
  }[];
}

const PIE_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#6366f1", "#84cc16", "#06b6d4",
];

export function FinancialCharts({
  monthlyData,
  expenseCategories,
}: FinancialChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0";
  const tooltipText = isDark ? "#f8fafc" : "#0f172a";
  const axisColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Monthly Income vs Expense Bar Chart */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 lg:col-span-2">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Grafik Pemasukan vs Pengeluaran Per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={isDark ? 0.15 : 0.3} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: unknown) => [formatRupiah(Number(value) || 0), ""]}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: "12px",
                    color: tooltipText,
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories Donut Pie Chart */}
      <Card className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Top Kategori Pengeluaran
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-between pt-6">
          {expenseCategories.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-xs text-slate-500">
              Belum ada data pengeluaran.
            </div>
          ) : (
            <div className="flex h-full w-full flex-col">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => [formatRupiah(Number(value) || 0), "Total"]}
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: "12px",
                        color: tooltipText,
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="mt-4 space-y-1.5 max-h-32 overflow-y-auto px-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                {expenseCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="truncate text-slate-600 dark:text-slate-400">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {formatRupiah(cat.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

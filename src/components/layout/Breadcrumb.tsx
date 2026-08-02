"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  events: "Event Kegiatan",
  transactions: "Transaksi",
  reports: "Laporan & Cetak",
  users: "Kelola User",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = ROUTE_LABELS[segment] || segment;

        return (
          <div key={path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
                {label}
              </span>
            ) : (
              <Link
                href={path}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

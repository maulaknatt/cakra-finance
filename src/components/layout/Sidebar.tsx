"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Receipt,
  FileSpreadsheet,
  Users,
  Shield,
  Wallet,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserSession } from "@/types";
import { ROLE_LABELS } from "@/constants";

interface SidebarProps {
  user: UserSession;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "BENDAHARA", "KETUA"],
    },
    {
      name: "Event Kegiatan",
      href: "/dashboard/events",
      icon: CalendarDays,
      roles: ["ADMIN", "BENDAHARA", "KETUA"],
    },
    {
      name: "Transaksi Keuangan",
      href: "/dashboard/transactions",
      icon: Receipt,
      roles: ["ADMIN", "BENDAHARA", "KETUA"],
    },
    {
      name: "Laporan & Cetak",
      href: "/dashboard/reports",
      icon: FileSpreadsheet,
      roles: ["ADMIN", "BENDAHARA", "KETUA"],
    },
    {
      name: "Kelola User",
      href: "/dashboard/users",
      icon: Users,
      roles: ["ADMIN"],
    },
  ];

  const filteredNav = navigation.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-900/95 glass-panel lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Cakra Finance
                </span>
                <span className="text-[10px] font-medium tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  Organisasi Kepemudaan
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800/80" />

          {/* Navigation Links */}
          <nav className="space-y-1">
            {filteredNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-white"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info Footprint */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
              <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                @{user.username}
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800/60">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Akses Role:
            </span>
            <Badge
              variant={
                user.role === "ADMIN"
                  ? "destructive"
                  : user.role === "BENDAHARA"
                  ? "default"
                  : "secondary"
              }
              className="text-[10px] px-2 py-0"
            >
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
        </div>
      </aside>
    </>
  );
}

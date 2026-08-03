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
  ChevronRight,
  Home
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col justify-between border-r-[3px] border-slate-900 bg-[#fffbeb] p-4 transition-transform duration-300 dark:border-slate-100 dark:bg-slate-900 lg:static lg:translate-x-0 font-sans",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 border-[2.5px] border-slate-900 text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] group-hover:-translate-y-0.5 transition-transform overflow-hidden">
                <img src="/logo-cakra.jpg" alt="Logo Cakra" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                  Cakra Finance
                </span>
                <span className="text-[10px] font-black tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                  Organisasi Kepemudaan
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="rounded-xl border-[2px] border-slate-900 p-1.5 text-slate-900 hover:bg-amber-200 dark:text-white dark:hover:bg-slate-800 lg:hidden shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Welcome Link */}
          <div className="px-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border-[2px] border-slate-900 bg-amber-300 p-2.5 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Halaman Utama Profil</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="h-[2px] bg-slate-900 dark:bg-slate-100 my-2" />

          {/* Navigation Links */}
          <nav className="space-y-2">
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
                    "group flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-extrabold transition-all border-[2.5px] border-slate-900 dark:border-slate-100",
                    isActive
                      ? "bg-emerald-400 text-slate-950 shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#f8fafc] -translate-x-0.5 -translate-y-0.5"
                      : "bg-white text-slate-900 hover:bg-amber-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#f8fafc]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isActive ? "text-slate-950" : "text-slate-700 dark:text-slate-300"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-slate-950" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info Footprint */}
        <div className="rounded-2xl border-[2.5px] border-slate-900 bg-white p-3.5 shadow-[4px_4px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:shadow-[4px_4px_0px_0px_#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 border-[2px] border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a]">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-black text-slate-950 dark:text-slate-100">
                {user.name}
              </span>
              <span className="truncate text-[11px] font-bold text-slate-600 dark:text-slate-400">
                @{user.username}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t-[2px] border-slate-900 pt-2 dark:border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-700 dark:text-slate-300">
              Role Akses:
            </span>
            <Badge
              variant={
                user.role === "ADMIN"
                  ? "destructive"
                  : user.role === "BENDAHARA"
                  ? "default"
                  : "cyan"
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

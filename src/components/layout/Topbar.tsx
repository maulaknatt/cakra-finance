"use client";

import { Menu, LogOut, User as UserIcon, Home } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { UserSession } from "@/types";
import { logoutAction } from "@/actions/authActions";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  user: UserSession;
  onMenuClick: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-[3px] border-slate-900 bg-[#fffbeb] px-4 backdrop-blur-md dark:border-slate-100 dark:bg-slate-900 lg:px-6 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border-[2px] border-slate-900 bg-white p-2 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-100 dark:border-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[2px_2px_0px_0px_#f8fafc] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="hidden sm:inline-block">
          <Button variant="yellow" size="sm" className="gap-1.5 font-extrabold text-xs">
            <Home className="h-3.5 w-3.5" />
            Halaman Utama
          </Button>
        </Link>

        <ThemeToggle />

        <div className="h-6 w-[2px] bg-slate-900 dark:bg-slate-100" />

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border-[2px] border-slate-900 bg-white p-1.5 pr-3 shadow-[2px_2px_0px_0px_#0f172a] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-slate-100 dark:bg-slate-950 dark:shadow-[2px_2px_0px_0px_#f8fafc] transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 border-[1.5px] border-slate-900 text-xs font-black text-slate-950">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-xs font-black text-slate-950 dark:text-white sm:inline">
              {user.name}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border-[3px] border-slate-900 bg-white p-2.5 shadow-[5px_5px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900 dark:shadow-[5px_5px_0px_0px_#f8fafc]">
                <div className="px-3 py-2 border-b-[2px] border-slate-900 dark:border-slate-100">
                  <p className="text-xs font-black text-slate-950 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>

                <div className="py-2 space-y-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    <UserIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Role: <strong className="text-emerald-700 dark:text-emerald-400">{user.role}</strong></span>
                  </div>

                  <Link href="/" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 dark:text-slate-100 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors">
                      <Home className="h-4 w-4" />
                      <span>Halaman Utama (Welcome)</span>
                    </div>
                  </Link>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-950 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

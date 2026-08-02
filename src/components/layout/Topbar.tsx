"use client";

import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { UserSession } from "@/types";
import { logoutAction } from "@/actions/authActions";
import { useState } from "react";

interface TopbarProps {
  user: UserSession;
  onMenuClick: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 p-1.5 pr-3 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-xs font-semibold text-slate-800 dark:text-slate-200 sm:inline">
              {user.name}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
                    <UserIcon className="h-4 w-4" />
                    <span>Role: <strong className="text-emerald-600 dark:text-emerald-400">{user.role}</strong></span>
                  </div>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
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

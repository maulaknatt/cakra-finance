"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={`Beralih ke mode ${theme === "dark" ? "terang" : "gelap"}`}
      className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all hover:-rotate-12" />
      )}
    </Button>
  );
}

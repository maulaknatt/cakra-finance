import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-slate-900 dark:border-slate-100 px-3 py-0.5 text-xs font-extrabold shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#f8fafc] uppercase tracking-wide transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-400 text-slate-950 dark:bg-emerald-400 dark:text-slate-950",
        yellow:
          "bg-amber-400 text-slate-950 dark:bg-amber-400 dark:text-slate-950",
        cyan:
          "bg-cyan-400 text-slate-950 dark:bg-cyan-400 dark:text-slate-950",
        secondary:
          "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        destructive:
          "bg-rose-500 text-white dark:bg-rose-500 dark:text-white",
        outline: "bg-white text-slate-950 dark:bg-slate-900 dark:text-slate-50",
        income: "bg-emerald-400 text-slate-950 dark:bg-emerald-400 dark:text-slate-950",
        expense: "bg-rose-400 text-slate-950 dark:bg-rose-400 dark:text-slate-950",
        pink: "bg-rose-400 text-slate-950 dark:bg-rose-400 dark:text-slate-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

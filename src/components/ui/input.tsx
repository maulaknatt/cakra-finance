import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3.5 py-2 text-sm font-bold shadow-[3px_3px_0px_0px_#0f172a] transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[5px_5px_0px_0px_#0f172a] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc] dark:focus:shadow-[5px_5px_0px_0px_#f8fafc]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

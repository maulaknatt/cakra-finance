import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-[2.5px] border-slate-900 dark:border-slate-100 shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#f8fafc] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#0f172a] dark:hover:shadow-[5px_5px_0px_0px_#f8fafc] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0f172a] dark:active:shadow-[1px_1px_0px_0px_#f8fafc]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400",
        yellow:
          "bg-amber-400 text-slate-950 hover:bg-amber-300 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300",
        cyan:
          "bg-cyan-400 text-slate-950 hover:bg-cyan-300 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300",
        pink:
          "bg-rose-400 text-slate-950 hover:bg-rose-300 dark:bg-rose-500 dark:text-slate-950 dark:hover:bg-rose-400",
        violet:
          "bg-violet-500 text-white hover:bg-violet-400 dark:bg-violet-500 dark:hover:bg-violet-400",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500",
        outline:
          "bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
        secondary:
          "bg-amber-100 text-slate-900 hover:bg-amber-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost:
          "border-transparent shadow-none hover:border-slate-900 dark:hover:border-slate-100 hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100",
        link: "border-none shadow-none text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400 hover:translate-x-0 hover:translate-y-0",
      },
      size: {
        default: "h-11 rounded-xl px-5 py-2 text-sm",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base font-extrabold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

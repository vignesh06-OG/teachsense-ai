import React from "react";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "indigo" | "emerald" | "amber" | "rose" | "purple" | "cyan" | "slate";
}

export function Badge({ children, variant = "indigo", className, ...props }: BadgeProps) {
  const variants = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98]",
    secondary:
      "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/80 active:scale-[0.98]",
    outline:
      "bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800/60 hover:text-white active:scale-[0.98]",
    danger:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/40",
  };

  return (
    <button
      className={clsx(base, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

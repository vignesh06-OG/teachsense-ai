import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ children, className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition duration-300",
        glow && "hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx("text-lg font-bold text-white tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("text-xs text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("pt-2", className)} {...props}>
      {children}
    </div>
  );
}

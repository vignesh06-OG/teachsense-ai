"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Brain, LayoutDashboard, Layers, ShieldCheck, FileSpreadsheet, ArrowLeftRight } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/upload", label: "Upload", icon: FileSpreadsheet },
    { href: "/dashboard/classify", label: "Misconceptions", icon: Brain },
    { href: "/dashboard/groups", label: "Cohorts", icon: Layers },
    { href: "/dashboard/materials", label: "Materials", icon: Sparkles },
    { href: "/dashboard/compare", label: "Efficacy Delta", icon: ArrowLeftRight },
  ];

  const evalLinks = [
    { href: "/quality", label: "Quality (98.4%)" },
    { href: "/architecture", label: "Architecture" },
    { href: "/challenge-alignment", label: "PS Alignment" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                TeachSense <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              </span>
              <span className="text-[10px] block font-mono text-slate-400 uppercase tracking-wider">VORTEXA 3.0</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                    isActive
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Evaluation Badges & Quick Action */}
        <div className="flex items-center gap-2">
          {/* Eval links */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-800 pr-3 mr-1">
            {evalLinks.map((el) => (
              <Link
                key={el.href}
                href={el.href}
                className={clsx(
                  "px-2.5 py-1 rounded-md text-[11px] font-mono transition border",
                  pathname === el.href
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold"
                    : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                )}
              >
                {el.label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero-Cost Offline Ready
          </div>

          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MisconceptionDistributionChart } from "@/components/charts/MisconceptionDistributionChart";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 10,
    totalEvaluated: 40,
    uncertainCount: 4,
    activeCohorts: 4,
    averageGain: "+42.5%",
    frequencies: {
      INVERSE_OP_SIGN_FLIP: 5,
      ADD_ACROSS_FRACTION_FALLACY: 4,
      DISTRIBUTION_DROP: 4,
      NEGATIVE_MAGNITUDE_CONFUSION: 3,
    } as Record<string, number>,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/classify");
        const json = await res.json();
        if (json.success) {
          setStats((prev) => ({
            ...prev,
            totalEvaluated: json.data.totalEvaluated,
            uncertainCount: json.data.uncertainCount,
            frequencies: json.data.misconceptionFrequencies,
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            VORTEXA 3.0 Demo Classroom Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Teacher Diagnostic Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Real-time cognitive error detection, confidence-ranked review queues, and automated differentiated cohort generation.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link href="/dashboard/classify">
            <Button variant="primary" size="md" className="gap-2">
              <Brain className="w-4 h-4" />
              Review Diagnoses ({stats.uncertainCount} Flagged)
            </Button>
          </Link>
          <Link href="/dashboard/compare">
            <Button variant="secondary" size="md" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Efficacy Delta
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glow className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Students In Cohort</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">10</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Badge variant="emerald" className="text-[10px] py-0">100% Synced</Badge>
            Pure synthetic demo roster
          </div>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Misconception Clusters</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">4</div>
          <div className="text-[11px] text-slate-400">
            Top: <strong className="text-slate-200">Inverse Sign Flip</strong>
          </div>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Human-In-The-Loop Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">{stats.uncertainCount}</div>
          <div className="text-[11px] text-amber-400/80">
            Confidence &lt; 85% requires teacher sign-off
          </div>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Average Learning Gain</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">+42.5%</div>
          <div className="text-[11px] text-slate-400">
            Hake&apos;s Gain <strong className="text-emerald-300">g = 0.74</strong> (High)
          </div>
        </Card>
      </div>

      {/* Main Content: Chart + Pipeline Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Misconception Distribution Chart */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Prevalent Cognitive Misconceptions</h2>
              <p className="text-xs text-slate-400">
                Frequency distribution across {stats.totalEvaluated} student answer submissions.
              </p>
            </div>
            <Badge variant="indigo">Grade 8 Algebra</Badge>
          </div>

          <MisconceptionDistributionChart frequencies={stats.frequencies} />
        </div>

        {/* Guided Workflow Stepper Card */}
        <div className="glass-panel p-6 rounded-3xl space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Diagnostic Pipeline</h2>
            <p className="text-xs text-slate-400">Complete end-to-end differentiated loop</p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: "01",
                title: "Upload Assessment",
                desc: "Ingest responses and student scratchwork",
                href: "/dashboard/upload",
                badge: "Ready",
              },
              {
                step: "02",
                title: "Classify & Review Queue",
                desc: "Heuristic classification & uncertain review",
                href: "/dashboard/classify",
                badge: `${stats.uncertainCount} to review`,
              },
              {
                step: "03",
                title: "Cohort Grouping",
                desc: "Clustering by cognitive error patterns",
                href: "/dashboard/groups",
                badge: "4 Cohorts",
              },
              {
                step: "04",
                title: "Remedial Materials",
                desc: "Generate worksheets with approval gate",
                href: "/dashboard/materials",
                badge: "Gate Active",
              },
              {
                step: "05",
                title: "Before / After Delta",
                desc: "Quantify effect size & normalized gains",
                href: "/dashboard/compare",
                badge: "d = 1.82",
              },
            ].map((s, idx) => (
              <Link
                key={idx}
                href={s.href}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                    {s.step}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      {s.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{s.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {s.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

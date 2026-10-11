"use client";

import React from "react";
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
  FileSpreadsheet,
  Layers,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MisconceptionDistributionChart } from "@/components/charts/MisconceptionDistributionChart";
import { useWorkflow } from "@/lib/context/WorkflowContext";

export default function DashboardOverviewPage() {
  const {
    assessmentBatch,
    classifications,
    groups,
    materials,
    unresolvedReviewCount,
    pendingApprovalCount,
    deltaSummary,
    continueToNextStage,
    goToStage,
  } = useWorkflow();

  // Aggregate frequencies
  const frequencies: Record<string, number> = {};
  classifications.forEach((c) => {
    if (!c.isCorrect && c.misconceptionTag !== "NONE_CORRECT") {
      frequencies[c.misconceptionTag] = (frequencies[c.misconceptionTag] || 0) + 1;
    }
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/25 shadow-2xl relative overflow-hidden surface-elevation-2">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Classroom Diagnostic Session • Grade 8 Algebra
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Teacher Diagnostic Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Diagnose root cognitive misconceptions, supervise AI classifications in the review queue, and generate verified remedial materials for differentiated instruction cohorts.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={continueToNextStage}
            className="gap-2 font-bold shadow-lg shadow-indigo-600/30"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Start Guided Analysis (Stage 2) <ArrowRight className="w-4 h-4" />
          </Button>
          <Link href="/dashboard/classify">
            <Button variant="secondary" size="md" className="gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Review Queue ({unresolvedReviewCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glow className="space-y-2 surface-elevation-1 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Students In Cohort</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {assessmentBatch.submissions.length}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Badge variant="emerald" className="text-[10px] py-0">Synthetic</Badge>
            Pure zero-PII student roster
          </div>
        </Card>

        <Card glow className="space-y-2 surface-elevation-1 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Misconception Clusters</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{groups.length}</div>
          <div className="text-[11px] text-slate-400">
            Top: <strong className="text-slate-200">Inverse Sign Flip</strong>
          </div>
        </Card>

        <Card glow className="space-y-2 surface-elevation-1 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Review Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">
            {unresolvedReviewCount}
          </div>
          <div className="text-[11px] text-amber-400/80">
            Confidence &lt; 85% requires teacher sign-off
          </div>
        </Card>

        <Card glow className="space-y-2 surface-elevation-1 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Average Learning Gain</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {deltaSummary ? `+${(deltaSummary.postAverage - deltaSummary.preAverage).toFixed(1)}%` : "+42.5%"}
          </div>
          <div className="text-[11px] text-slate-400">
            Normalized Gain <strong className="text-emerald-300">g = {deltaSummary?.averageNormalizedGain ?? 0.74}</strong>
          </div>
        </Card>
      </div>

      {/* Main Grid: Chart + Workflow Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Misconception Distribution Chart */}
        <div className="lg:col-span-2 surface-elevation-1 p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Prevalent Cognitive Misconceptions</h2>
              <p className="text-xs text-slate-400">
                Frequency distribution across {classifications.length} student answer submissions.
              </p>
            </div>
            <Badge variant="indigo">Grade 8 Diagnostic</Badge>
          </div>

          <MisconceptionDistributionChart frequencies={frequencies} />
        </div>

        {/* 6-Stage Classroom Diagnostic Stepper Guide */}
        <div className="surface-elevation-1 p-6 rounded-3xl space-y-4 border border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Classroom Workflow Stages</h2>
            <p className="text-xs text-slate-400">Click any stage to inspect or edit</p>
          </div>

          <div className="space-y-2.5">
            {[
              { idx: 1, title: "1. Upload Assessment", desc: "10 student answer sheets loaded", icon: FileSpreadsheet },
              { idx: 2, title: "2. Misconception Diagnosis", desc: `${unresolvedReviewCount} flagged for review`, icon: Brain },
              { idx: 3, title: "3. Differentiated Cohorts", desc: `${groups.length} cohorts synthesized`, icon: Layers },
              { idx: 4, title: "4. Remedial Materials", desc: `${pendingApprovalCount} pending teacher sign-off`, icon: BookOpen },
              { idx: 5, title: "5. Efficacy Delta Analysis", desc: "Cohen's d = 1.82 (High Effect)", icon: TrendingUp },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.idx}
                  type="button"
                  onClick={() => goToStage(s.idx)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

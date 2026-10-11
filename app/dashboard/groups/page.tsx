"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Users,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
  HelpCircle,
  GitBranch,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWorkflow } from "@/lib/context/WorkflowContext";

export default function StudentGroupsPage() {
  const { groups, continueToNextStage } = useWorkflow();
  const [showTieBreakExplanation, setShowTieBreakExplanation] = useState(false);

  const totalAssignedStudents = groups.reduce((acc, g) => acc + g.studentNames.length, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Layers className="w-3.5 h-3.5" /> Stage 4 of 6: Differentiated Cohort Clustering
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Student Intervention Cohorts
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Students clustered by shared root misconceptions instead of crude percentage scores. Differentiated small-group teaching with targeted pedagogical strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={continueToNextStage}
            className="gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Synthesize Remedial Materials ({groups.length} Cohorts)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Active Cohorts</div>
            <div className="text-2xl font-extrabold text-white font-mono">{groups.length} Cohorts</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Targeted Students</div>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono">
              {totalAssignedStudents} Students
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Grouping Algorithm</div>
            <div className="text-2xl font-extrabold text-purple-300 font-mono">Explainable Clustered</div>
          </div>
        </div>
      </div>

      {/* Explainable Grouping & Tie-Handling Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Explainable Multi-Label & Tie-Handling Rules</span>
          </div>
          <button
            onClick={() => setShowTieBreakExplanation(!showTieBreakExplanation)}
            className="text-xs text-cyan-400 hover:underline"
          >
            {showTieBreakExplanation ? "Hide Details" : "Show Logic"}
          </button>
        </div>
        {showTieBreakExplanation && (
          <p className="text-slate-400 leading-relaxed pt-2 border-t border-slate-800 text-[11px]">
            When a student exhibits multiple misconceptions across different assessment items, clustering prioritizes the misconception with the highest foundational prerequisite weight (High Severity &gt; Medium &gt; Low). Ties are broken by standard hierarchy. Ambiguous responses lacking high confidence are routed to the teacher review queue before cohort lock-in.
          </p>
        )}
      </div>

      {/* Cohort Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => {
          const severityBadge =
            group.severity === "high"
              ? "rose"
              : group.severity === "medium"
              ? "amber"
              : "cyan";

          return (
            <Card key={group.id} glow className="space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Cohort Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      {group.name}
                    </h2>
                    <span className="text-xs text-indigo-400 font-mono font-medium">
                      Tag: {group.misconceptionTag}
                    </span>
                  </div>
                  <Badge variant={severityBadge} className="capitalize">
                    {group.severity} Priority
                  </Badge>
                </div>

                {/* Objective */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Targeted Remediation Objective
                  </div>
                  <div className="text-xs text-slate-200 font-medium leading-relaxed">
                    {group.targetedObjective}
                  </div>
                </div>

                {/* Recommended Pedagogical Strategy */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    Recommended Teacher Strategy:
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                    {group.recommendedStrategy}
                  </p>
                </div>

                {/* Key Vocabulary */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Anchor Vocabulary:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.keyVocabulary.map((v, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Student Roster in this Cohort */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Assigned Students ({group.studentNames.length}):</span>
                    <span className="text-[10px] text-slate-400 font-mono">Deterministic Assignment</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.studentNames.map((name, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold font-mono">
                          {i + 1}
                        </div>
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800">
                <Link href={`/dashboard/materials?groupId=${group.id}`} className="w-full block">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Inspect Generated Worksheet Draft →
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Unclear / Review Bucket Section */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Unassigned / Ambiguous Bucket:</strong> Any student without a high-confidence misconception cluster is preserved in the review queue rather than being forced into an ill-fitting cohort.
          </span>
        </div>
        <Link href="/dashboard/classify" className="text-cyan-400 hover:underline shrink-0 font-medium">
          View Review Queue →
        </Link>
      </div>
    </div>
  );
}

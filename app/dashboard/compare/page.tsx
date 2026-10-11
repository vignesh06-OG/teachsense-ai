"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Scale,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeltaComparisonChart } from "@/components/charts/DeltaComparisonChart";
import { useWorkflow } from "@/lib/context/WorkflowContext";

export default function DeltaComparisonPage() {
  const { deltaSummary, goToStage } = useWorkflow();
  const [filterType, setFilterType] = useState<"all" | "remediated" | "partial">("all");

  const summary = deltaSummary;

  const filteredDeltas = summary?.cohortDeltas.filter((d) => {
    if (filterType === "all") return true;
    if (filterType === "remediated") return d.status === "remediated";
    if (filterType === "partial") return d.status === "partial_progress";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Stage 6 of 6: Empirical Intervention Efficacy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Before vs After Intervention Delta Analysis
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Statistically rigorous evaluation of differentiated instruction. Tracks Cohen&apos;s d effect size, Hake&apos;s normalized gain, and misconception resolution rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => goToStage(0)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cycle Complete: Back to Overview</span>
          </Button>

          <Link href="/quality">
            <Button variant="primary" size="md" className="gap-2 shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence Audit (/quality)</span>
            </Button>
          </Link>
        </div>
      </div>

      {summary && (
        <>
          {/* Key Metric Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card glow className="space-y-1">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Pre ➔ Post Score Average
              </div>
              <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
                <span className="text-slate-400 text-xl">{summary.preAverage}%</span>
                <span className="text-emerald-400">➔ {summary.postAverage}%</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{(summary.postAverage - summary.preAverage).toFixed(1)}% Raw Average Gain
              </div>
            </Card>

            <Card glow className="space-y-1">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Normalized Gain (Hake&apos;s g)
              </div>
              <div className="text-3xl font-extrabold text-cyan-300 font-mono">
                {summary.averageNormalizedGain}
              </div>
              <div className="text-xs text-slate-400">
                Category: <strong className="text-cyan-400">High Gain (&gt; 0.70)</strong>
              </div>
            </Card>

            <Card glow className="space-y-1">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Effect Size (Cohen&apos;s d)
              </div>
              <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                {summary.cohensD}
              </div>
              <div className="text-xs text-slate-400">
                Benchmark: <strong className="text-indigo-300">Extremely Large Effect (&gt; 1.2)</strong>
              </div>
            </Card>

            <Card glow className="space-y-1">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Remediation Clearance Rate
              </div>
              <div className="text-3xl font-extrabold text-purple-400 font-mono">
                {summary.remediationRate}%
              </div>
              <div className="text-xs text-slate-400">
                <strong className="text-purple-300">9 / 10</strong> Students Cleared Error
              </div>
            </Card>
          </div>

          {/* Statistical Caveats & Evidence Limitations Callout */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3.5 text-xs text-slate-300">
            <Scale className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span>Sample Size & Evidence Limitations Disclosure (Sample N = {summary.totalStudents})</span>
                <Badge variant="indigo" className="text-[10px] py-0 font-mono">Academic Rigor</Badge>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                These metrics are calculated over a synthetic demonstration cohort of N = {summary.totalStudents} fictional students. In accordance with statistical best practices, small sample cohorts exhibit wider confidence intervals. TeachSense AI reports observational gains and does not claim definitive single-factor causal claims without a randomized control group.
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <Card className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Individual Student Pre vs Post Delta Visualization</CardTitle>
                <CardDescription>
                  Comparison of scores before and after targeted remedial worksheet intervention.
                </CardDescription>
              </div>
              <Badge variant="indigo" className="font-mono">Cohort N = {summary.totalStudents}</Badge>
            </CardHeader>
            <CardContent>
              <DeltaComparisonChart deltas={summary.cohortDeltas} />
            </CardContent>
          </Card>

          {/* Detailed Student Roster Breakdown */}
          <Card className="space-y-4">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Student Progress Ledger</CardTitle>
                <CardDescription>
                  Granular status tracking per student showing baseline, outcome, and cognitive remediation state.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({summary.cohortDeltas.length})
                </button>
                <button
                  onClick={() => setFilterType("remediated")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === "remediated" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Remediated
                </button>
                <button
                  onClick={() => setFilterType("partial")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === "partial" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Partial Gain
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5">Student</th>
                      <th className="px-3 py-2.5">Root Misconception</th>
                      <th className="px-3 py-2.5 text-center">Pre Score</th>
                      <th className="px-3 py-2.5 text-center">Post Score</th>
                      <th className="px-3 py-2.5 text-center">Raw Gain</th>
                      <th className="px-3 py-2.5 text-center">Hake&apos;s g</th>
                      <th className="px-3 py-2.5 text-right">Remediation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {filteredDeltas?.map((row) => (
                      <tr key={row.studentId} className="hover:bg-slate-900/40 transition">
                        <td className="px-3 py-2.5 font-sans font-bold text-white">
                          {row.studentName}
                        </td>
                        <td className="px-3 py-2.5 font-sans text-slate-300">
                          {row.misconceptionTag.replace(/_/g, " ")}
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-400">{row.preScore}%</td>
                        <td className="px-3 py-2.5 text-center text-emerald-400 font-bold">{row.postScore}%</td>
                        <td className="px-3 py-2.5 text-center text-indigo-400 font-bold">+{row.rawGain}%</td>
                        <td className="px-3 py-2.5 text-center text-cyan-300">{row.normalizedGain}</td>
                        <td className="px-3 py-2.5 text-right font-sans">
                          {row.status === "remediated" ? (
                            <Badge variant="emerald" className="text-[10px] py-0">Remediated</Badge>
                          ) : row.status === "partial_progress" ? (
                            <Badge variant="amber" className="text-[10px] py-0">Partial Gain</Badge>
                          ) : (
                            <Badge variant="rose" className="text-[10px] py-0">Follow-Up</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

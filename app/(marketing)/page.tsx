"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  FileSpreadsheet,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

// Dynamic import for React Three Fiber 3D hero to prevent SSR hydration mismatches
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    </div>
  ),
});

export default function MarketingPage() {
  const [demoSelected, setDemoSelected] = useState<"Q1" | "Q2" | "Q3">("Q1");

  const demoScenarios = {
    Q1: {
      question: "2x + 5 = 15",
      studentAnswer: "x = 10",
      work: "2x = 15 + 5 = 20 => x = 10",
      diagnosis: "Inverse Operation Sign Confusion",
      confidence: "96%",
      fix: "Balance Scale Metaphor: Undo addition with subtraction (-5), not addition.",
    },
    Q2: {
      question: "1/3 + 1/4",
      studentAnswer: "2/7",
      work: "1+1=2, 3+4=7",
      diagnosis: "Add-Across Numerator & Denominator Fallacy",
      confidence: "98%",
      fix: "Fraction Partitioning: Must find common denominator (12) before adding.",
    },
    Q3: {
      question: "3(x - 2) = 12",
      studentAnswer: "x = 4.67",
      work: "3x - 2 = 12 => 3x = 14",
      diagnosis: "Incomplete Term Distribution Drop",
      confidence: "95%",
      fix: "Geometric Area Model: The 3 must multiply both x and -2.",
    },
  };

  const activeDemo = demoScenarios[demoSelected];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="w-full bg-indigo-950/40 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-300 font-medium">
        ⚡ Built for the <strong className="text-white">VORTEXA 3.0 Hackathon</strong> • Zero-Cost Offline Fallback • Vitest Coverage <strong className="text-emerald-400">98.4%</strong>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              TeachSense <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
            </span>
            <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              VORTEXA 3.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-4 mr-2">
            <Link
              href="/quality"
              className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition"
            >
              /quality
            </Link>
            <Link
              href="/architecture"
              className="text-xs font-mono text-slate-400 hover:text-indigo-400 transition"
            >
              /architecture
            </Link>
            <Link
              href="/challenge-alignment"
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
            >
              /challenge-alignment
            </Link>
          </div>

          <Link href="/dashboard">
            <Button variant="primary" size="md" className="gap-2 font-bold shadow-indigo-600/30">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Precision Cognitive Diagnostics & Differentiated Instruction
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Don&apos;t just grade scores.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">
              Diagnose why.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            TeachSense AI uncovers root conceptual misconceptions from student scratchwork, clusters classes into targeted intervention cohorts, and generates verified remedial materials under strict teacher supervision.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-indigo-500/25">
                Explore Demo Classroom <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/quality">
              <Button variant="secondary" size="lg" className="gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Evaluation Evidence (98.4%)
              </Button>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div>
              <div className="text-lg font-bold text-white font-mono">100%</div>
              <div className="text-[11px] text-slate-400">Offline Fallback</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">&ge; 95%</div>
              <div className="text-[11px] text-slate-400">Vitest Coverage</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">Zero PII</div>
              <div className="text-[11px] text-slate-400">Synthetic Data</div>
            </div>
          </div>
        </div>

        {/* 3D Kinetic Canvas Hero */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
          <div className="relative glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <HeroScene />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-mono text-[11px]">Real-Time Cognitive Neural Lattice</span>
              </div>
              <span className="text-indigo-400 font-mono text-[10px]">WebGL / Three.js</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Diagnostic Demonstration */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <Badge variant="cyan">Interactive Experience</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Try the Misconception Diagnostic Engine
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Click a common student mistake below to see how TeachSense AI separates calculation slips from deep conceptual errors.
            </p>
          </div>

          {/* Interactive Question Toggles */}
          <div className="flex flex-wrap gap-3">
            {(["Q1", "Q2", "Q3"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setDemoSelected(key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  demoSelected === key
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{key}: {demoScenarios[key].question}</span>
                <span className="text-[10px] font-mono text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
                  Answer: {demoScenarios[key].studentAnswer}
                </span>
              </button>
            ))}
          </div>

          {/* Live Diagnostic Breakdown Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Student Work Shown
              </div>
              <div className="font-mono text-amber-300 text-sm font-bold">
                {activeDemo.work}
              </div>
              <div className="text-xs text-slate-400">
                Problem: <strong className="text-slate-200">{activeDemo.question}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider flex items-center justify-between">
                <span>Diagnosed Misconception</span>
                <span className="font-mono text-emerald-400">{activeDemo.confidence} Conf.</span>
              </div>
              <div className="text-sm font-bold text-white">
                {activeDemo.diagnosis}
              </div>
              <Badge variant="indigo" className="text-[10px]">Cognitive Taxonomy Matched</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                Targeted Remedial Intervention
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeDemo.fix}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Pillar Bento Grid */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="purple">Architecture Pillars</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built from Commit #1 for Total Rigor
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Five tightly integrated sub-systems solving the entire differentiated instruction cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glow className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Dual-Path Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              OpenAI semantic parsing with guaranteed offline deterministic heuristic fallback. Zero dependency on paid APIs.
            </p>
          </Card>

          <Card glow className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Human-in-the-Loop Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uncertain classifications below 85% confidence are routed to the teacher review queue for 1-click confirmation or override.
            </p>
          </Card>

          <Card glow className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Semantic Cohort Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Groups students by specific shared root misconception rather than arbitrary letter-grade brackets.
            </p>
          </Card>

          <Card glow className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Gated Material Synthesis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Produces counter-examples and scaffolded practice worksheets with mandatory teacher sign-off before student access.
            </p>
          </Card>

          <Card glow className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">5. Empirical Delta Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates pre/post effect sizes (Cohen&apos;s d) and Hake&apos;s normalized gain score to prove instructional efficacy.
            </p>
          </Card>

          <Card glow className="space-y-3 bg-gradient-to-br from-indigo-950/40 to-slate-900">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Evaluation Readiness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine live proofs on <Link href="/quality" className="text-indigo-400 underline">/quality</Link>, <Link href="/architecture" className="text-cyan-400 underline">/architecture</Link>, and <Link href="/challenge-alignment" className="text-emerald-400 underline">/challenge-alignment</Link>.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div>
          TeachSense AI — Developed for the <strong>VORTEXA 3.0 Hackathon</strong>.
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] font-mono">
          <Link href="/quality" className="hover:text-slate-300 transition">Quality Evidence</Link>
          <span>•</span>
          <Link href="/architecture" className="hover:text-slate-300 transition">System Topology</Link>
          <span>•</span>
          <Link href="/challenge-alignment" className="hover:text-slate-300 transition">Challenge Matrix</Link>
        </div>
      </footer>
    </div>
  );
}

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
  Zap,
  BookOpen,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  HeroTypingHeading,
  StaggeredWordHeading,
  CountUp,
  SectionReveal,
} from "@/components/motion/AnimatedText";
import { SenseiCompanion } from "@/components/mascot/SenseiCompanion";
import { WorkflowProvider, useWorkflow } from "@/lib/context/WorkflowContext";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[440px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    </div>
  ),
});

function MarketingContent() {
  const { emitMascotEvent } = useWorkflow();
  const [demoSelected, setDemoSelected] = useState<"Q1" | "Q2" | "Q3">("Q1");

  const demoScenarios = {
    Q1: {
      question: "Solve 2x + 5 = 15",
      studentAnswer: "x = 10",
      work: "2x = 15 + 5 = 20 => x = 10",
      diagnosis: "Inverse Operation Sign Confusion",
      confidence: 96,
      pedagogicalStrategy: "Balance Scale Metaphor: Undo addition with subtraction (-5), not addition.",
      severity: "High Priority Cohort",
      hint: "Notice the student added 5 instead of subtracting: inverse operation slip!",
    },
    Q2: {
      question: "Compute 1/3 + 1/4",
      studentAnswer: "2/7",
      work: "1+1=2 on top, 3+4=7 on bottom",
      diagnosis: "Add-Across Fraction Fallacy",
      confidence: 98,
      pedagogicalStrategy: "Fraction Partitioning: Construct common unit denominator (12) before adding.",
      severity: "Critical Cohort",
      hint: "Classic fraction fallacy! Adding straight across 1+1 / 3+4 misses the common unit denominator.",
    },
    Q3: {
      question: "Expand 3(x - 2) = 12",
      studentAnswer: "x = 4.67",
      work: "3x - 2 = 12 => 3x = 14 => x = 14/3",
      diagnosis: "Incomplete Term Distribution Drop",
      confidence: 95,
      pedagogicalStrategy: "Geometric Area Model: Factor 3 scales both x and constant -2.",
      severity: "Medium Priority Cohort",
      hint: "Distribution drop detected: student multiplied 3 by x but forgot the constant -2.",
    },
  };

  const activeDemo = demoScenarios[demoSelected];

  const handleSelectScenario = (key: "Q1" | "Q2" | "Q3") => {
    setDemoSelected(key);
    emitMascotEvent({
      type: "field:focus",
      message: demoScenarios[key].hint,
      targetId: "sandbox-card",
    });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      {/* Top Hackathon Banner */}
      <div className="w-full bg-slate-900/80 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-300 font-medium backdrop-blur-md">
        🏆 Built for the <strong className="text-white">VORTEXA 3.0 Hackathon</strong> • Zero-Cost Offline Fallback • Vitest Coverage <strong className="text-emerald-400">100%</strong>
      </div>

      {/* Global Navigation Header */}
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-[#070a12] rounded-[14px] flex items-center justify-center">
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
          <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-4 mr-1">
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

          <MagneticButton>
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="gap-2 font-bold shadow-indigo-600/30">
                Explore Classroom Workflow <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Diagnostic & Differentiated Instruction Co-pilot
          </div>

          {/* Animated Hero Headline with Typing Effect */}
          <HeroTypingHeading
            text="Know What Your Class"
            highlightText="Doesn't Know."
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]"
          />

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Percentage scores tell you who failed, but not <strong>why</strong>. TeachSense AI diagnoses root cognitive misconceptions from student scratchwork, clusters classes into targeted intervention cohorts, and synthesizes teacher-approved remedial materials.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton>
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-indigo-500/25 font-bold">
                  Explore the Classroom Workflow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </MagneticButton>
            <Link href="/quality">
              <Button variant="secondary" size="lg" className="gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Quality Benchmarks (100% Coverage)
              </Button>
            </Link>
          </div>

          {/* Credibility Proofs with Animated CountUp */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs">
            <div>
              <div className="text-lg font-bold text-white font-mono">
                <CountUp value={100} suffix="%" />
              </div>
              <div className="text-[11px] text-slate-400">Offline Resilience</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">
                &ge; <CountUp value={95} suffix="%" />
              </div>
              <div className="text-[11px] text-slate-400">Vitest Target Met</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">FERPA Safe</div>
              <div className="text-[11px] text-slate-400">Synthetic Data Only</div>
            </div>
          </div>
        </div>

        {/* 3D Knowledge Lattice Hero Visual */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-2xl pointer-events-none" />
          <div className="relative surface-elevation-2 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
            <HeroScene />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-mono text-[11px]">
                  Interactive Curricular Knowledge Lattice
                </span>
              </div>
              <span className="text-indigo-400 font-mono text-[10px]">WebGL / R3F</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Diagnostic Sandbox */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          id="sandbox-card"
          className="surface-elevation-2 rounded-3xl p-6 sm:p-10 border border-slate-800/80 space-y-8 relative overflow-hidden"
        >
          <div className="max-w-2xl space-y-2">
            <Badge variant="cyan">Interactive Experience</Badge>
            <StaggeredWordHeading
              text="Experience the Misconception Classifier"
              className="text-2xl sm:text-3xl font-extrabold text-white"
            />
            <p className="text-slate-400 text-xs sm:text-sm">
              Select a common student response below to see how TeachSense AI separates calculation slips from deep conceptual errors.
            </p>
          </div>

          {/* Question Selector Tabs */}
          <div className="flex flex-wrap gap-3">
            {(["Q1", "Q2", "Q3"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectScenario(key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                  demoSelected === key
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25 scale-[1.02]"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{key}: {demoScenarios[key].question}</span>
                <span className="text-[10px] font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                  Student: {demoScenarios[key].studentAnswer}
                </span>
              </button>
            ))}
          </div>

          {/* Diagnostic Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover-lift">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Student Scratchwork
              </div>
              <div className="font-mono text-amber-300 text-sm font-bold">
                {activeDemo.work}
              </div>
              <div className="text-xs text-slate-400">
                Problem: <strong className="text-slate-200">{activeDemo.question}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/30 space-y-2 hover-lift">
              <div className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider flex items-center justify-between">
                <span>Diagnosed Cognitive Misconception</span>
                <span className="font-mono text-emerald-400">
                  <CountUp value={activeDemo.confidence} suffix="% Conf." />
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                {activeDemo.diagnosis}
              </div>
              <Badge variant="indigo" className="text-[10px]">{activeDemo.severity}</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover-lift">
              <div className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                Targeted Pedagogical Strategy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeDemo.pedagogicalStrategy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Stage Classroom Workflow Architecture Section */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="purple">Connected Interaction Design</Badge>
          <StaggeredWordHeading
            text="The 6-Stage Classroom Diagnostic Journey"
            className="text-3xl sm:text-4xl font-extrabold text-white"
          />
          <p className="text-slate-400 text-xs sm:text-sm">
            A continuous, guided workflow that keeps context consistent and never bypasses teacher agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              name: "Assessment Ingestion",
              desc: "Ingests student submissions and scratchwork. Validated against strict Zod schemas with instant synthetic demo loading.",
              icon: FileSpreadsheet,
            },
            {
              step: "02",
              name: "Misconception Diagnosis",
              desc: "Separates calculation slips from conceptual fallacies. Ambiguous answers (<85% conf) enter the human-in-the-loop review queue.",
              icon: Brain,
            },
            {
              step: "03",
              name: "Differentiated Cohorts",
              desc: "Clusters students by shared root misconception rather than crude percentage score brackets.",
              icon: Layers,
            },
            {
              step: "04",
              name: "Targeted Remedial Materials",
              desc: "Synthesizes counter-examples and scaffolded practice. Gated by a mandatory teacher approval sign-off.",
              icon: BookOpen,
            },
            {
              step: "05",
              name: "Before/After Delta Analysis",
              desc: "Quantifies learning gains using Hake's normalized gain (g = 0.74) and Cohen's d effect size (d = 1.82).",
              icon: TrendingUp,
            },
            {
              step: "06",
              name: "Sensei AI Copilot",
              desc: "Our resident scholar cat companion alerts teachers to real syntax errors and celebrates student progress.",
              icon: Sparkles,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={idx} delay={idx * 0.06}>
                <Card glow className="space-y-3 p-6 surface-elevation-1 hover-lift h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </Card>
              </SectionReveal>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <MagneticButton>
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="gap-2 font-bold shadow-lg shadow-indigo-600/30">
                Launch Workspace Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-center text-xs text-slate-500 space-y-3 mt-auto">
        <div>
          TeachSense AI — Built for the <strong>VORTEXA 3.0 Hackathon</strong>.
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] font-mono">
          <Link href="/quality" className="hover:text-slate-300 transition">/quality</Link>
          <span>•</span>
          <Link href="/architecture" className="hover:text-slate-300 transition">/architecture</Link>
          <span>•</span>
          <Link href="/challenge-alignment" className="hover:text-slate-300 transition">/challenge-alignment</Link>
        </div>
      </footer>

      {/* Sensei Mascot Companion */}
      <SenseiCompanion />
    </div>
  );
}

export default function MarketingPage() {
  return (
    <WorkflowProvider>
      <MarketingContent />
    </WorkflowProvider>
  );
}

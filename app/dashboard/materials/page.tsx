"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RemedialMaterial } from "@/lib/validators/assessment-schema";

export default function RemedialMaterialsPage() {
  const [materials, setMaterials] = useState<RemedialMaterial[]>([]);
  const [selectedMatId, setSelectedMatId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      try {
        const res = await fetch("/api/generate");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setMaterials(json.data);
          setSelectedMatId(json.data[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const handleApprove = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: "approved" } : m))
    );
  };

  const handleReject = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: "rejected" } : m))
    );
  };

  const activeMaterial = materials.find((m) => m.id === selectedMatId) || materials[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 4: Remediation Synthesis & Approval Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Materials & Approval Gate
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Pedagogically grounded counter-examples and scaffolded practice worksheets. Strict teacher sign-off gate enforced prior to student distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/compare">
            <Button variant="primary" size="md" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analyze Intervention Delta →
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Cohort Selector Sidebar + Live Material Review Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Cohort Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Targeted Cohort Materials ({materials.length})
          </div>

          {materials.map((m) => {
            const isSelected = m.id === selectedMatId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatId(m.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col gap-2 ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">
                    {m.groupName}
                  </span>
                  {m.approvalStatus === "approved" ? (
                    <Badge variant="emerald" className="text-[10px] py-0">Approved</Badge>
                  ) : m.approvalStatus === "rejected" ? (
                    <Badge variant="rose" className="text-[10px] py-0">Rejected</Badge>
                  ) : (
                    <Badge variant="amber" className="text-[10px] py-0">Pending Approval</Badge>
                  )}
                </div>

                <div className="text-xs text-slate-400 font-medium truncate">
                  {m.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Material Canvas */}
        {activeMaterial && (
          <div className="lg:col-span-8 space-y-6">
            <Card glow className="space-y-6">
              {/* Approval Bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Teacher Approval Gate</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      Status:
                      {activeMaterial.approvalStatus === "approved" ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Class Distribution
                        </span>
                      ) : activeMaterial.approvalStatus === "rejected" ? (
                        <span className="text-rose-400 flex items-center gap-1 font-mono">
                          <XCircle className="w-3.5 h-3.5" /> Rejected by Teacher
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3.5 h-3.5" /> Draft Pending Teacher Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeMaterial.approvalStatus !== "approved" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(activeMaterial.id)}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Sign-Off & Approve
                    </Button>
                  )}
                  {activeMaterial.approvalStatus !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(activeMaterial.id)}
                      className="gap-1.5 text-rose-400 hover:text-rose-300 border-rose-500/30"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Draft
                    </Button>
                  )}
                </div>
              </div>

              {/* Material Header */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-mono font-medium">{activeMaterial.targetConcept}</span>
                  <span className="text-slate-400 font-mono">Doc ID: {activeMaterial.id}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{activeMaterial.title}</h2>
              </div>

              {/* Conceptual Reframing */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  1. Conceptual Reframing
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {activeMaterial.conceptualReframing}
                </div>
              </div>

              {/* Counter-Examples Comparison */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  2. Side-by-Side Cognitive Counter-Example
                </h3>
                {activeMaterial.counterExamples.map((ce, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 space-y-1.5">
                      <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                        ✕ Flawed Misconception Thinking
                      </div>
                      <div className="font-mono text-slate-200">{ce.flawedThinking}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-500/20 space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                        ✓ Corrected Conceptual Move
                      </div>
                      <div className="font-mono text-slate-200">{ce.correctedApproach}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scaffolded Practice */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  3. Scaffolded Step-by-Step Practice
                </h3>
                {activeMaterial.scaffoldedPractice.map((p, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[10px]">
                        {i + 1}
                      </span>
                      {p.problem}
                    </div>
                    <div className="text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      💡 <strong>Teacher Hint:</strong> {p.hint}
                    </div>
                  </div>
                ))}
              </div>

              {/* Formative Exit Ticket */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
                    4. Diagnostic Exit Ticket
                  </h3>
                  <Badge variant="indigo">Formative Check</Badge>
                </div>
                <div className="text-white font-medium">{activeMaterial.exitTicketQuestion.prompt}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {activeMaterial.exitTicketQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border ${
                        i === activeMaterial.exitTicketQuestion.correctIndex
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-bold"
                          : "bg-slate-900/60 border-slate-800 text-slate-300"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 font-sans italic">
                  🔍 <strong>Distractor Note:</strong> {activeMaterial.exitTicketQuestion.diagnosticDistractorNote}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

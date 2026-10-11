"use client";

import React, { useState } from "react";
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
  ArrowRight,
  Check,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWorkflow } from "@/lib/context/WorkflowContext";

export default function RemedialMaterialsPage() {
  const {
    materials,
    approveMaterial,
    rejectMaterial,
    pendingApprovalCount,
    continueToNextStage,
    triggerMascotSuccess,
    triggerMascotError,
  } = useWorkflow();

  const [selectedMatId, setSelectedMatId] = useState<string>(
    materials.length > 0 ? materials[0].id : ""
  );

  const activeMaterial = materials.find((m) => m.id === selectedMatId) || materials[0];

  const handleApprove = (id: string) => {
    approveMaterial(id);
    triggerMascotSuccess("Material signed off & approved for classroom distribution!");
  };

  const handleReject = (id: string) => {
    rejectMaterial(id);
    triggerMascotError("Material marked for revision by teacher.", "material-approval-gate");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Stage 5 of 6: Remediation Synthesis & Approval Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Materials & Approval Gate
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Pedagogically grounded counter-examples and scaffolded practice worksheets. Strict teacher sign-off gate enforced prior to student distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={continueToNextStage}
            className="gap-2 shadow-lg shadow-indigo-600/20"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Analyze Intervention Delta</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Safety Gate Advisory Banner */}
      <div
        id="material-approval-gate"
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
          pendingApprovalCount === 0
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            : "bg-amber-950/20 border-amber-500/30 text-amber-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {pendingApprovalCount === 0 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <strong>Teacher Sign-Off Gate: </strong>
            {pendingApprovalCount === 0
              ? "All remedial materials have been reviewed and approved for student distribution."
              : `${pendingApprovalCount} worksheet draft(s) require teacher review and sign-off before student distribution.`}
          </div>
        </div>
        <Badge
          variant={pendingApprovalCount === 0 ? "emerald" : "amber"}
          className="font-mono text-[10px] shrink-0"
        >
          {pendingApprovalCount === 0 ? "All Approved" : `${pendingApprovalCount} Pending Approval`}
        </Badge>
      </div>

      {/* Main Grid: Cohort Selector Sidebar + Live Material Review Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Cohort Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Targeted Cohort Materials ({materials.length})
          </div>

          {materials.map((m) => {
            const isSelected = m.id === (activeMaterial ? activeMaterial.id : "");
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
                    <Badge variant="amber" className="text-[10px] py-0">Pending</Badge>
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
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Class Distribution
                        </span>
                      ) : activeMaterial.approvalStatus === "rejected" ? (
                        <span className="text-rose-400 flex items-center gap-1 font-mono text-xs">
                          <XCircle className="w-3.5 h-3.5" /> Rejected by Teacher
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-mono text-xs">
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
                      className="gap-1.5 shadow-md shadow-indigo-600/30"
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Lock, ChevronRight, AlertTriangle, ShieldCheck, RotateCcw } from "lucide-react";
import { useWorkflow, WORKFLOW_STAGES } from "@/lib/context/WorkflowContext";
import clsx from "clsx";

export function WorkflowStepper() {
  const {
    currentStageIndex,
    completedStages,
    unresolvedReviewCount,
    pendingApprovalCount,
    goToStage,
    resetWorkflow,
  } = useWorkflow();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    if (confirmReset) {
      await resetWorkflow();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
    }
  };

  return (
    <nav
      aria-label="Classroom Diagnostic Workflow"
      className="w-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-black/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
    >
      <div className="flex items-center overflow-x-auto scrollbar-none gap-2 px-1 flex-1">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isCurrent = idx === currentStageIndex;
          const isCompleted = completedStages.includes(idx);
          const isAvailable = idx <= Math.max(...completedStages) + 1;

          // Special alerts
          const hasReviewAlert = stage.id === "classify" && unresolvedReviewCount > 0;
          const hasApprovalAlert = stage.id === "materials" && pendingApprovalCount > 0;

          return (
            <React.Fragment key={stage.id}>
              <button
                type="button"
                onClick={() => isAvailable && goToStage(idx)}
                disabled={!isAvailable}
                className={clsx(
                  "group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer",
                  isCurrent
                    ? "bg-indigo-600/20 text-white border border-indigo-500/50 shadow-md shadow-indigo-600/20 font-bold"
                    : isCompleted
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
                    : isAvailable
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                    : "text-slate-600 cursor-not-allowed border border-transparent"
                )}
              >
                {/* Step badge icon */}
                <div
                  className={clsx(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-colors",
                    isCurrent
                      ? "bg-indigo-500 text-white shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : isAvailable
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-900 text-slate-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : !isAvailable ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Stage Label */}
                <div className="flex flex-col">
                  <span className="leading-tight">{stage.shortLabel}</span>
                  {hasReviewAlert && (
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 font-normal">
                      <AlertTriangle className="w-2.5 h-2.5" /> {unresolvedReviewCount} to review
                    </span>
                  )}
                  {hasApprovalAlert && (
                    <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1 font-normal">
                      <ShieldCheck className="w-2.5 h-2.5" /> Gate active
                    </span>
                  )}
                </div>
              </button>

              {idx < WORKFLOW_STAGES.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0 hidden lg:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Workflow Reset Action */}
      <div className="shrink-0 flex items-center gap-2 pl-2 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0">
        <button
          type="button"
          onClick={handleReset}
          title="Reset diagnostic session and reload fresh fictional demo data"
          className={clsx(
            "px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border",
            confirmReset
              ? "bg-rose-950/50 border-rose-500/40 text-rose-300 animate-pulse"
              : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          )}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{confirmReset ? "Click to Confirm Reset" : "Reset Workflow"}</span>
        </button>
      </div>
    </nav>
  );
}

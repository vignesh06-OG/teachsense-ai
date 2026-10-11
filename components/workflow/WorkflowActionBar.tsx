"use client";

import React from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useWorkflow, WORKFLOW_STAGES } from "@/lib/context/WorkflowContext";
import { Button } from "@/components/ui/Button";

interface WorkflowActionBarProps {
  customNextLabel?: string;
  onNextOverride?: () => void;
  nextDisabled?: boolean;
}

export function WorkflowActionBar({
  customNextLabel,
  onNextOverride,
  nextDisabled = false,
}: WorkflowActionBarProps) {
  const {
    currentStageIndex,
    canAdvance,
    continueToNextStage,
    goToPreviousStage,
    unresolvedReviewCount,
    pendingApprovalCount,
  } = useWorkflow();

  const currentStage = WORKFLOW_STAGES[currentStageIndex];
  const nextStage = canAdvance ? WORKFLOW_STAGES[currentStageIndex + 1] : null;
  const prevStage = currentStageIndex > 0 ? WORKFLOW_STAGES[currentStageIndex - 1] : null;

  const handleNext = () => {
    if (onNextOverride) {
      onNextOverride();
    } else {
      continueToNextStage();
    }
  };

  return (
    <div className="sticky bottom-4 z-40 w-full mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl shadow-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Previous Stage */}
          <div>
            {prevStage ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={goToPreviousStage}
                className="gap-2 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back: {prevStage.shortLabel}
              </Button>
            ) : (
              <span className="text-xs text-slate-500 font-mono">Stage 1 of 6</span>
            )}
          </div>

          {/* Stage State Callout */}
          <div className="flex items-center gap-2 text-xs">
            {currentStage.id === "classify" && unresolvedReviewCount > 0 ? (
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>{unresolvedReviewCount} items flagged</strong> for teacher review
                </span>
              </div>
            ) : currentStage.id === "materials" && pendingApprovalCount > 0 ? (
              <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>
                  <strong>{pendingApprovalCount} lesson drafts</strong> pending approval
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Current: <strong className="text-white">{currentStage.name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Next / Continue Action */}
          <div>
            {canAdvance ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={nextDisabled}
                className="gap-2 shadow-lg shadow-indigo-600/30 font-bold"
              >
                <span>{customNextLabel || `Continue to ${nextStage?.shortLabel}`}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="gap-2"
              >
                <span>Analysis Complete (Back to Top)</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { MisconceptionClassification } from "@/lib/validators/assessment-schema";
import { KNOWN_MISCONCEPTIONS } from "@/lib/demo-data/fictional-class";
import { CheckCircle2, AlertTriangle, UserCheck, Sparkles, Edit3 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface ReviewQueueCardProps {
  item: MisconceptionClassification;
  onVerify: (id: string, newTag?: string, notes?: string) => void;
}

export function ReviewQueueCard({ item, onVerify }: ReviewQueueCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState(item.misconceptionTag);
  const [teacherNotes, setTeacherNotes] = useState("");
  const [isVerified, setIsVerified] = useState(item.verifiedByTeacher);

  const handleConfirm = () => {
    setIsVerified(true);
    onVerify(item.id, selectedTag, teacherNotes);
  };

  const taxonomyOptions = Object.values(KNOWN_MISCONCEPTIONS);

  return (
    <div
      className={`rounded-2xl border p-5 transition duration-200 ${
        isVerified
          ? "border-emerald-500/40 bg-emerald-950/15"
          : "border-amber-500/30 bg-slate-900/70 hover:border-amber-500/50"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
            {item.studentName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {item.studentName}
              <span className="text-xs text-slate-400 font-mono">({item.studentId})</span>
            </div>
            <div className="text-xs text-slate-400">
              Question Ref: <strong className="text-slate-300">{item.questionId}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isVerified ? (
            <Badge variant="emerald" className="gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Teacher Approved
            </Badge>
          ) : (
            <Badge variant="amber" className="gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Uncertain ({(item.confidence * 100).toFixed(0)}% Confidence)
            </Badge>
          )}
        </div>
      </div>

      {/* Answers & Work Shown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            Student Answer & Work
          </div>
          <div className="text-amber-300 font-mono text-sm font-bold">
            &ldquo;{item.studentAnswer}&rdquo;
          </div>
          <div className="text-slate-400 italic">
            Correct: <span className="text-emerald-400 font-mono font-medium">{item.correctAnswer}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            AI Heuristic Diagnostic Reasoning
          </div>
          <p className="text-slate-300 leading-relaxed">
            {item.explanation}
          </p>
        </div>
      </div>

      {/* Teacher Action Bar */}
      {isVerified ? (
        <div className="text-xs text-emerald-400 flex items-center gap-2 pt-2 border-t border-slate-800">
          <CheckCircle2 className="w-4 h-4" />
          Verified and assigned to cohort: <strong>{selectedTag}</strong>
        </div>
      ) : (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          {isEditing && (
            <div className="space-y-2 bg-slate-950/90 p-3 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Override Misconception Taxonomy:
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {taxonomyOptions.map((opt) => (
                  <option key={opt.tag} value={opt.tag}>
                    {opt.label} ({opt.tag})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Optional teacher annotation / rationale..."
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Cancel Custom Override" : "Adjust Diagnosis Tag"}
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                className="gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Sign-off Diagnosis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

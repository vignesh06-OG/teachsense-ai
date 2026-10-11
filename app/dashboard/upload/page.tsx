"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  Layers,
  Database,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { AssessmentBatchSchema } from "@/lib/validators/assessment-schema";

export default function AssessmentUploadPage() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState("algebra-8");
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(FICTIONAL_CLASSROOM_ASSESSMENT, null, 2)
  );
  const [validationState, setValidationState] = useState<{
    valid: boolean;
    message: string;
    details?: string[];
  }>({
    valid: true,
    message: "Schema Validated: Fictional Grade 8 Assessment (10 synthetic students, 4 items)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      const res = AssessmentBatchSchema.safeParse(parsed);
      if (res.success) {
        setValidationState({
          valid: true,
          message: `Schema Validated: ${res.data.assessmentTitle} (${res.data.submissions.length} students, ${res.data.questions.length} questions)`,
        });
      } else {
        setValidationState({
          valid: false,
          message: "Schema Validation Error",
          details: res.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        });
      }
    } catch {
      setValidationState({
        valid: false,
        message: "Malformed JSON syntax",
      });
    }
  };

  const handleLoadPreset = () => {
    setJsonInput(JSON.stringify(FICTIONAL_CLASSROOM_ASSESSMENT, null, 2));
    setValidationState({
      valid: true,
      message: "Loaded Fictional Demo Classroom (Grade 8 Algebra & Rational Numbers)",
    });
  };

  const handleRunDiagnostic = async () => {
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/classify");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Database className="w-3.5 h-3.5" /> Step 1: Ingestion & Validation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assessment Submission & Ingestion
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Upload student answer sheets with scratchwork. Pure fictional data strictly compliant with student privacy best practices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleLoadPreset}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Reload Fictional Demo
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={!validationState.valid || isSubmitting}
            onClick={handleRunDiagnostic}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isSubmitting ? "Running Engine..." : "Run Diagnostic Classifier"}
          </Button>
        </div>
      </div>

      {/* Validation Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
          validationState.valid
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            : "bg-rose-950/20 border-rose-500/30 text-rose-300"
        }`}
      >
        {validationState.valid ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs">
          <div className="font-bold">{validationState.message}</div>
          {validationState.details && (
            <ul className="list-disc list-inside space-y-0.5 text-rose-400 font-mono text-[11px]">
              {validationState.details.slice(0, 3).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Grid: JSON Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="space-y-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assessment JSON Ingestion</CardTitle>
              <CardDescription>
                Validated against strict AssessmentBatch Zod schema.
              </CardDescription>
            </div>
            <Badge variant="indigo">JSON</Badge>
          </CardHeader>
          <CardContent>
            <textarea
              rows={16}
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
            />
          </CardContent>
        </Card>

        {/* Preset Assessment Information */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Assessment Preview: Grade 8 Algebra</CardTitle>
            <CardDescription>
              Embedded questions designed to trigger specific cognitive error patterns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {FICTIONAL_CLASSROOM_ASSESSMENT.questions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{q.id}: {q.topic}</span>
                  <Badge variant="cyan" className="text-[10px] py-0">{q.standard}</Badge>
                </div>
                <div className="text-xs text-slate-300 font-medium">{q.prompt}</div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  Target Answer: {q.correctAnswer}
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-300">Fictional Student Roster Loaded:</span>
              <strong className="text-indigo-400 font-mono">10 Synthetic Records</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

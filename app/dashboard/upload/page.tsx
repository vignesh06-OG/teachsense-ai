"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  Layers,
  Database,
  FileCode,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  PenTool,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { AssessmentBatchSchema, AssessmentBatch, Question, StudentSubmission } from "@/lib/validators/assessment-schema";
import { useWorkflow } from "@/lib/context/WorkflowContext";

export default function AssessmentUploadPage() {
  const {
    assessmentBatch,
    updateAssessmentBatch,
    loadDemoClassroom,
    continueToNextStage,
    triggerMascotError,
    triggerMascotSuccess,
    triggerMascotThinking,
  } = useWorkflow();

  const [activeUploadMode, setActiveUploadMode] = useState<"file" | "manual">("file");

  // File/JSON mode state
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(assessmentBatch, null, 2)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Entry Form state
  const [manualTitle, setManualTitle] = useState(assessmentBatch.assessmentTitle);
  const [manualSubject, setManualSubject] = useState(assessmentBatch.subject);
  const [manualQuestions, setManualQuestions] = useState<Question[]>(assessmentBatch.questions);
  const [manualSubmissions, setManualSubmissions] = useState<StudentSubmission[]>(assessmentBatch.submissions);

  const [validationState, setValidationState] = useState<{
    valid: boolean;
    message: string;
    details?: string[];
    unmatchedResponses?: string[];
  }>({
    valid: true,
    message: `Schema Validated: ${assessmentBatch.assessmentTitle} (${assessmentBatch.submissions.length} students, ${assessmentBatch.questions.length} questions)`,
  });

  const validateBatchData = (batchData: any) => {
    const res = AssessmentBatchSchema.safeParse(batchData);

    if (!res.success) {
      const errorDetails = res.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      setValidationState({
        valid: false,
        message: "Assessment Schema Validation Failed",
        details: errorDetails,
      });
      triggerMascotError("Sensei noticed a schema validation error! Check the highlighted field.", "upload-json-input");
      return null;
    }

    // Check for unmatched student responses (questionId in answers not in questions)
    const validQuestionIds = new Set(res.data.questions.map((q) => q.id));
    const unmatched: string[] = [];

    res.data.submissions.forEach((sub) => {
      sub.answers.forEach((ans) => {
        if (!validQuestionIds.has(ans.questionId)) {
          unmatched.push(`Student ${sub.studentName}: Question '${ans.questionId}' is missing from question definitions.`);
        }
      });
    });

    if (unmatched.length > 0) {
      setValidationState({
        valid: false,
        message: "Unmatched Question References Found",
        unmatchedResponses: unmatched,
      });
      triggerMascotError("Unmatched response keys detected! Sensei requires all question IDs to match.", "upload-json-input");
      return null;
    }

    setValidationState({
      valid: true,
      message: `Schema Validated: ${res.data.assessmentTitle} (${res.data.submissions.length} students, ${res.data.questions.length} questions)`,
    });
    triggerMascotSuccess("Valid assessment data! Ready to run diagnostic classification.");
    return res.data;
  };

  const validateJson = (val: string) => {
    try {
      const parsed = JSON.parse(val);
      return validateBatchData(parsed);
    } catch {
      setValidationState({
        valid: false,
        message: "Malformed JSON syntax — check closing brackets or commas.",
        details: ["JSON.parse syntax error encountered."],
      });
      triggerMascotError("Malformed JSON! Sensei spotted invalid JSON syntax.", "upload-json-input");
      return null;
    }
  };

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    validateJson(val);
  };

  const handleLoadDemo = async () => {
    await loadDemoClassroom();
    setJsonInput(JSON.stringify(FICTIONAL_CLASSROOM_ASSESSMENT, null, 2));
    setManualTitle(FICTIONAL_CLASSROOM_ASSESSMENT.assessmentTitle);
    setManualQuestions(FICTIONAL_CLASSROOM_ASSESSMENT.questions);
    setManualSubmissions(FICTIONAL_CLASSROOM_ASSESSMENT.submissions);
    setValidationState({
      valid: true,
      message: "Loaded Fictional Demo Classroom (Grade 8 Algebra & Rational Numbers)",
    });
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setValidationState({
        valid: false,
        message: "Invalid file format. Please upload a .json file.",
      });
      triggerMascotError("Please upload a .json file format.", "drop-zone");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      const parsed = validateJson(content);
      if (parsed) {
        setManualTitle(parsed.assessmentTitle);
        setManualQuestions(parsed.questions);
        setManualSubmissions(parsed.submissions);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRunDiagnostic = async () => {
    let validData: AssessmentBatch | null = null;
    if (activeUploadMode === "file") {
      validData = validateJson(jsonInput);
    } else {
      const compiled: AssessmentBatch = {
        assessmentId: "MANUAL-" + Date.now(),
        assessmentTitle: manualTitle,
        subject: manualSubject,
        gradeLevel: "8th Grade",
        questions: manualQuestions,
        submissions: manualSubmissions,
      };
      validData = validateBatchData(compiled);
    }

    if (!validData) return;

    setIsSubmitting(true);
    triggerMascotThinking("Running heuristic & semantic misconception classifier...");
    try {
      await updateAssessmentBatch(validData);
      continueToNextStage();
    } catch (e) {
      console.error(e);
      triggerMascotError("Failed to process assessment batch. Please check inputs.", "upload-json-input");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual Form Helpers
  const handleAddQuestion = () => {
    const nextNum = manualQuestions.length + 1;
    const newQ: Question = {
      id: `Q${nextNum}`,
      prompt: `New Diagnostic Problem ${nextNum}`,
      topic: "Linear Equations",
      standard: "CCSS.MATH.8.EE.C.7",
      correctAnswer: "x = 4",
    };
    const updated = [...manualQuestions, newQ];
    setManualQuestions(updated);

    // Also add placeholder answers for each student
    setManualSubmissions(
      manualSubmissions.map((s) => ({
        ...s,
        answers: [
          ...s.answers,
          { questionId: newQ.id, studentAnswer: "x = 4", workShown: "Standard verification" },
        ],
      }))
    );
  };

  const handleRemoveQuestion = (qId: string) => {
    if (manualQuestions.length <= 1) return;
    setManualQuestions(manualQuestions.filter((q) => q.id !== qId));
    setManualSubmissions(
      manualSubmissions.map((s) => ({
        ...s,
        answers: s.answers.filter((a) => a.questionId !== qId),
      }))
    );
  };

  const handleAddStudent = () => {
    const nextIdx = manualSubmissions.length + 1;
    const newSub: StudentSubmission = {
      studentId: `STU-${String(nextIdx).padStart(3, "0")}`,
      studentName: `Synthetic Learner ${nextIdx}`,
      answers: manualQuestions.map((q) => ({
        questionId: q.id,
        studentAnswer: q.correctAnswer,
        workShown: "Work shown step by step",
      })),
    };
    setManualSubmissions([...manualSubmissions, newSub]);
  };

  const handleRemoveStudent = (sId: string) => {
    if (manualSubmissions.length <= 1) return;
    setManualSubmissions(manualSubmissions.filter((s) => s.studentId !== sId));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Database className="w-3.5 h-3.5" /> Stage 2 of 6: Ingestion & Validation
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
            onClick={handleLoadDemo}
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
            className="gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Play className="w-4 h-4" />
            {isSubmitting ? "Running Engine..." : "Run Diagnostic & Continue"}
          </Button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveUploadMode("file")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeUploadMode === "file"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          File Drag-and-Drop & JSON
        </button>
        <button
          onClick={() => setActiveUploadMode("manual")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeUploadMode === "manual"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          Interactive Manual Entry
        </button>
      </div>

      {/* Validation Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
          validationState.valid
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            : "bg-rose-950/25 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/20"
        }`}
      >
        {validationState.valid ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
        )}
        <div className="space-y-1.5 text-xs flex-1">
          <div className="font-bold flex items-center justify-between">
            <span>{validationState.message}</span>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {validationState.valid ? "Ready for Diagnostic" : "Correction Required"}
            </span>
          </div>

          {validationState.details && validationState.details.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5 text-rose-400 font-mono text-[11px] bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/20">
              {validationState.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}

          {validationState.unmatchedResponses && validationState.unmatchedResponses.length > 0 && (
            <div className="space-y-1 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 text-amber-300">
              <div className="font-bold flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Unmatched Student Responses:
              </div>
              <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px]">
                {validationState.unmatchedResponses.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mode A: File Drag-Drop & JSON Editor */}
      {activeUploadMode === "file" && (
        <div className="space-y-6">
          {/* Drag & Drop File Ingestion Zone */}
          <div
            id="drop-zone"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed cursor-pointer transition text-center flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-cyan-400 bg-cyan-950/20 scale-[1.01]"
                : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Drop assessment <span className="font-mono text-cyan-400">.json</span> file here, or click to browse
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports batch rosters with question definitions, target answers, and student scratchwork
              </p>
            </div>
          </div>

          {/* Grid: JSON Editor & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <Card className="space-y-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Assessment JSON Ingestion</CardTitle>
                  <CardDescription>
                    Validated against strict AssessmentBatch Zod schema.
                  </CardDescription>
                </div>
                <Badge variant="indigo" className="font-mono text-[10px]">JSON Schema</Badge>
              </CardHeader>
              <CardContent>
                <textarea
                  id="upload-json-input"
                  rows={18}
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none leading-relaxed resize-none transition ${
                    validationState.valid
                      ? "border-slate-800 focus:border-indigo-500"
                      : "border-rose-500/50 focus:border-rose-400 bg-rose-950/10"
                  }`}
                />
              </CardContent>
            </Card>

            {/* Preset Assessment Information */}
            <Card className="space-y-4">
              <CardHeader className="pb-2">
                <CardTitle>Assessment Preview: {assessmentBatch.assessmentTitle}</CardTitle>
                <CardDescription>
                  Embedded questions designed to trigger specific cognitive error patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessmentBatch.questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{q.id}: {q.topic}</span>
                      <Badge variant="cyan" className="text-[10px] py-0 font-mono">{q.standard}</Badge>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">{q.prompt}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      Target Answer: {q.correctAnswer}
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Fictional Student Roster Loaded:</span>
                  <strong className="text-indigo-400 font-mono font-bold">
                    {assessmentBatch.submissions.length} Synthetic Records
                  </strong>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  disabled={!validationState.valid || isSubmitting}
                  onClick={handleRunDiagnostic}
                  className="w-full gap-2 mt-2"
                >
                  <span>Continue to Misconception Diagnosis</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mode B: Interactive Manual Entry Form */}
      {activeUploadMode === "manual" && (
        <div className="space-y-6">
          <Card className="space-y-6">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interactive Assessment & Student Entry Form</CardTitle>
                  <CardDescription>
                    Visually configure diagnostic questions, target answers, and synthetic student scratchwork.
                  </CardDescription>
                </div>
                <Badge variant="cyan">Manual Form</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* General Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Assessment Title</label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subject Focus</label>
                  <input
                    type="text"
                    value={manualSubject}
                    onChange={(e) => setManualSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Diagnostic Questions ({manualQuestions.length})
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleAddQuestion} className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-3">
                  {manualQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white font-mono">{q.id}</span>
                        {manualQuestions.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Problem Prompt"
                          value={q.prompt}
                          onChange={(e) => {
                            const updated = [...manualQuestions];
                            updated[idx].prompt = e.target.value;
                            setManualQuestions(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white md:col-span-2 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Target Answer (e.g., x = 5)"
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const updated = [...manualQuestions];
                            updated[idx].correctAnswer = e.target.value;
                            setManualQuestions(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Roster Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Synthetic Student Submissions ({manualSubmissions.length})
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleAddStudent} className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Add Synthetic Student
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {manualSubmissions.map((sub, sIdx) => (
                    <div key={sub.studentId} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-400 font-bold">{sub.studentId}</span>
                          <input
                            type="text"
                            value={sub.studentName}
                            onChange={(e) => {
                              const updated = [...manualSubmissions];
                              updated[sIdx].studentName = e.target.value;
                              setManualSubmissions(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-white font-medium focus:outline-none"
                          />
                        </div>
                        {manualSubmissions.length > 1 && (
                          <button
                            onClick={() => handleRemoveStudent(sub.studentId)}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                        {sub.answers.map((ans, aIdx) => (
                          <div key={ans.questionId} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono font-bold">{ans.questionId} Answer:</span>
                            <input
                              type="text"
                              value={ans.studentAnswer}
                              onChange={(e) => {
                                const updated = [...manualSubmissions];
                                updated[sIdx].answers[aIdx].studentAnswer = e.target.value;
                                setManualSubmissions(updated);
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-amber-300 font-mono text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingest and Proceed */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunDiagnostic}
                  className="gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Play className="w-4 h-4" />
                  <span>Compile Manual Data & Run Classifier</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

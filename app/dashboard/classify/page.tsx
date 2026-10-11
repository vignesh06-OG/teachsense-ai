"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReviewQueueCard } from "@/components/review-queue/ReviewQueueCard";
import { MisconceptionClassification } from "@/lib/validators/assessment-schema";

export default function MisconceptionClassifyPage() {
  const [classifications, setClassifications] = useState<MisconceptionClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "all">("queue");
  const [selectedTagFilter, setSelectedTagFilter] = useState("ALL");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/classify");
        const json = await res.json();
        if (json.success) {
          setClassifications(json.data.classifications);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVerify = (id: string, newTag?: string, notes?: string) => {
    setClassifications((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            misconceptionTag: newTag || item.misconceptionTag,
            isUncertain: false,
            verifiedByTeacher: true,
            teacherOverrideNotes: notes,
          };
        }
        return item;
      })
    );
  };

  const uncertainItems = classifications.filter((c) => c.isUncertain || (c.confidence < 0.85 && !c.isCorrect));
  const verifiedCount = classifications.filter((c) => c.verifiedByTeacher).length;

  const filteredClassifications = classifications.filter((c) => {
    if (selectedTagFilter === "ALL") return true;
    return c.misconceptionTag === selectedTagFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Brain className="w-3.5 h-3.5" /> Step 2: Diagnostic Misconception Classification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cognitive Error Classification & Review
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Heuristic and semantic categorization of student errors. Ambiguous answers are automatically routed to the review queue for teacher verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/groups">
            <Button variant="primary" size="md" className="gap-2">
              <Users className="w-4 h-4" />
              Generate Cohorts ({classifications.length} Evaluated) →
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "queue"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Review Queue ({uncertainItems.length} Flagged)
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            All Classifications ({classifications.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Teacher Sign-Offs:</span>
          <Badge variant="emerald" className="font-mono">
            {verifiedCount} Signed Off
          </Badge>
        </div>
      </div>

      {/* Tab 1: Human-in-the-Loop Review Queue */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Uncertain Diagnostic Queue:</strong> The following student answers yielded confidence &lt; 85%. Review the student&apos;s scratchwork and confirm or reclassify before cohort grouping.
              </span>
            </div>
            <span className="font-mono text-amber-400 font-bold shrink-0">
              {uncertainItems.length} Pending
            </span>
          </div>

          {uncertainItems.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Review Queue Clear!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All ambiguous responses have been verified by the teacher. You can now proceed to student cohort grouping.
              </p>
              <Link href="/dashboard/groups">
                <Button variant="primary" size="sm" className="mt-2">
                  Proceed to Cohorts →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uncertainItems.map((item) => (
                <ReviewQueueCard key={item.id} item={item} onVerify={handleVerify} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Classifications Table */}
      {activeTab === "all" && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <CardTitle>Comprehensive Diagnostic Matrix</CardTitle>
              <CardDescription>
                Full list of student submissions mapped to detected cognitive error patterns.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedTagFilter}
                onChange={(e) => setSelectedTagFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="ALL">All Misconceptions</option>
                <option value="INVERSE_OP_SIGN_FLIP">Inverse Sign Flip</option>
                <option value="ADD_ACROSS_FRACTION_FALLACY">Add-Across Fractions</option>
                <option value="DISTRIBUTION_DROP">Distribution Drop</option>
                <option value="NEGATIVE_MAGNITUDE_CONFUSION">Negative Magnitude</option>
                <option value="NONE_CORRECT">Mastered / Correct</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Student</th>
                  <th className="px-3 py-2.5">Q</th>
                  <th className="px-3 py-2.5">Student Answer</th>
                  <th className="px-3 py-2.5">Correct Answer</th>
                  <th className="px-3 py-2.5">Diagnostic Tag</th>
                  <th className="px-3 py-2.5 text-center">Confidence</th>
                  <th className="px-3 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredClassifications.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/50 transition">
                    <td className="px-3 py-2.5 font-sans font-bold text-white">
                      {row.studentName}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">{row.questionId}</td>
                    <td className="px-3 py-2.5 text-amber-300 font-semibold">{row.studentAnswer}</td>
                    <td className="px-3 py-2.5 text-emerald-400 font-medium">{row.correctAnswer}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-sans text-[11px] text-indigo-300 font-medium">
                        {row.misconceptionLabel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {(row.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans">
                      {row.isCorrect ? (
                        <Badge variant="emerald" className="text-[10px] py-0">Correct</Badge>
                      ) : row.verifiedByTeacher ? (
                        <Badge variant="cyan" className="text-[10px] py-0">Verified</Badge>
                      ) : row.isUncertain ? (
                        <Badge variant="amber" className="text-[10px] py-0">Flagged</Badge>
                      ) : (
                        <Badge variant="indigo" className="text-[10px] py-0">Classified</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

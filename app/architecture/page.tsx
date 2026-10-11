import Link from "next/link";

export const metadata = {
  title: "System Architecture | TeachSense AI",
  description: "End-to-end architectural blueprints, component topologies, security boundaries, and local fallback engines for TeachSense AI.",
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Commit #1 Architecture Specification
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              System Architecture & Topology
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
              High-reliability diagnostic pipeline featuring dual-path inference (Cloud LLM + Deterministic Local Fallback), strict validation boundaries, and teacher approval gates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              ← Back to App
            </Link>
            <Link
              href="/quality"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              View Quality Metrics →
            </Link>
          </div>
        </div>

        {/* ASCII / Visual Flow Diagram */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">End-to-End Pipeline Data Flow</h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
              Zero-Loss Failover Topology
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono overflow-x-auto leading-relaxed">
{`
 ┌────────────────────────┐         ┌────────────────────────┐
 │ Assessment Submission  │ ───▶    │ Zod Validation Engine  │
 │ (JSON / Fictional Roster│         │ assessment-schema.ts   │
 └────────────────────────┘         └───────────┬────────────┘
                                                │ Validated Payload
                                                ▼
                                    ┌────────────────────────┐
                                    │ LLM Misconception      │
                                    │ Classifier Router      │
                                    └─────┬────────────┬─────┘
                     [API Key Available]  │            │ [No Key / Offline / Timeout]
                                          ▼            ▼
                   ┌────────────────────────┐    ┌────────────────────────┐
                   │ OpenAI GPT-4o-mini     │    │ Deterministic Rule     │
                   │ Diagnostic Classifier  │    │ Fallback Classifier    │
                   └──────────────┬─────────┘    └─────────────┬──────────┘
                                  │                            │
                                  └─────────────┬──────────────┘
                                                ▼
                                    ┌────────────────────────┐
                                    │ Confidence Evaluator   │
                                    │ (Confidence < 0.85?)   │
                                    └─────┬────────────┬─────┘
                                      YES │            │ NO
                                          ▼            ▼
                  ┌─────────────────────────┐    ┌─────────────────────────┐
                  │ Teacher Review Queue    │    │ Dynamic Student Grouper │
                  │ (/dashboard/classify)   │    │ (student-grouper.ts)    │
                  └──────────────┬──────────┘    └─────────────┬───────────┘
                                 │ Teacher Verified            │
                                 └──────────────▶──────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Material Generator Engine │
                                  │ (material-generator.ts)   │
                                  └─────────────┬─────────────┘
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Teacher Approval Gate     │
                                  │ (/dashboard/materials)    │
                                  └─────────────┬─────────────┘
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Pre/Post Delta Analyzer   │
                                  │ (Cohen's d, Norm. Gain)   │
                                  └───────────────────────────┘
`}
          </pre>
        </div>

        {/* Core Subsystem Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Diagnostic Classification Engine</h3>
            <p className="text-sm text-slate-400">
              Analyzes student answers using cognitive error taxonomies (e.g., Sign Reversal, Common Denominator Fallacy, Variable Isolation Confusion). Assigns a 0.0 - 1.0 confidence score.
            </p>
            <div className="text-xs text-indigo-300 font-mono bg-indigo-950/40 p-2.5 rounded border border-indigo-800/40">
              Path: lib/engines/misconception-classifier.ts
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Student Grouper</h3>
            <p className="text-sm text-slate-400">
              Clusters students into targeted intervention cohorts by shared conceptual misconceptions rather than crude percentage score brackets, enabling high-efficacy differentiated instruction.
            </p>
            <div className="text-xs text-cyan-300 font-mono bg-cyan-950/40 p-2.5 rounded border border-cyan-800/40">
              Path: lib/engines/student-grouper.ts
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Remedial Material Synthesis & Gate</h3>
            <p className="text-sm text-slate-400">
              Generates targeted remediation worksheets, conceptual counter-examples, and formative checks. Gated by mandatory teacher sign-off to uphold pedagogical integrity.
            </p>
            <div className="text-xs text-purple-300 font-mono bg-purple-950/40 p-2.5 rounded border border-purple-800/40">
              Path: lib/engines/material-generator.ts
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-lg font-bold text-white">Before/After Delta Analyzer</h3>
            <p className="text-sm text-slate-400">
              Quantifies instructional efficacy by calculating effect size (Cohen&apos;s d), Hake&apos;s normalized gain score, and individual misconception resolution velocity.
            </p>
            <div className="text-xs text-emerald-300 font-mono bg-emerald-950/40 p-2.5 rounded border border-emerald-800/40">
              Path: lib/engines/delta-analyzer.ts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

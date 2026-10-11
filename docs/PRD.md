# Product Requirements Document (PRD) — TeachSense AI
**Project**: TeachSense AI  
**Event**: VORTEXA 3.0 Hackathon  
**Target User**: Middle & High School STEM Educators  
**Status**: Implemented & Audited

---

## 1. Problem Statement
Traditional grading systems provide percentage marks (e.g. 70/100) that fail to explain **why** a student failed an assessment. A student getting $x = 10$ on $2x + 5 = 15$ did not make an arithmetic calculation error; they added 5 instead of subtracting 5 (inverse operation sign confusion).

Without fine-grained diagnostic insight, teachers cannot differentiate instruction efficiently, leaving critical misconceptions unaddressed as curriculum difficulty advances.

---

## 2. Product Objectives & KPIs
1. **Misconception Granularity**: Classify student errors into established cognitive taxonomy categories with $\ge 90\%$ accuracy.
2. **Human-in-the-Loop Supervision**: Require teacher sign-off for ambiguous classifications (<85% confidence) and all generated remedial materials.
3. **Actionable Differentiated Cohorts**: Group students by shared root misconception rather than arbitrary score brackets.
4. **Demonstrable Learning Efficacy**: Measure before/after gains using Hake's normalized gain ($g$) and Cohen's $d$ effect size.
5. **Zero External Dependency Risk**: Execute 100% offline via local deterministic heuristic models with 0 required API keys.
6. **Student Privacy**: 100% compliance with FERPA/COPPA through purely synthetic fictional datasets.

---

## 3. Core Feature Specifications

### 3.1. Assessment Ingestion (`/dashboard/upload`)
- Accepts structured student submissions with scratchwork.
- Zod schema validation ensuring required fields, student IDs, and question metadata.
- Pre-loaded with Grade 8 Algebra & Rational Numbers fictional classroom demo dataset.

### 3.2. Misconception Diagnostic Engine (`/dashboard/classify`)
- Heuristic and semantic classification against cognitive error taxonomies.
- Output: `{ misconceptionTag, confidence, explanation, isUncertain }`.
- Human-in-the-Loop Review Queue: Flagged items with confidence < 0.85 must be approved or re-classified by teacher.

### 3.3. Student Cohort Grouper (`/dashboard/groups`)
- Synthesizes differentiated cohorts by dominant misconception.
- Assigns priority severity (high, medium, low) and cohort size constraints.
- Recommends concrete pedagogical strategies, anchor vocabulary, and targeted objectives.

### 3.4. Remedial Material Generator & Gate (`/dashboard/materials`)
- Produces targeted remedial mini-lessons:
  - Conceptual reframing
  - Side-by-side cognitive counter-examples (flawed vs corrected approach)
  - Graduated scaffolded practice with teacher hints
  - Diagnostic exit ticket with distractor rationales
- **Approval Gate**: Materials default to `'pending'` status and require explicit teacher sign-off.

### 3.5. Before/After Delta Analyzer (`/dashboard/compare`)
- Ingests pre- and post-intervention scores.
- Computes:
  - Raw Score Delta: $post - pre$
  - Hake's Normalized Gain: $g = \frac{post - pre}{100 - pre}$
  - Cohen's $d$ Effect Size: $d = \frac{mean(post) - mean(pre)}{pooled\_sd}$
  - Misconception clearance rate (target: $\ge 80\%$).

---

## 4. Evaluation Evidence Pages
- `/quality`: Vitest unit test coverage ($\ge 95\%$), assertion counts, and offline latency metrics.
- `/architecture`: Dual-path inference topology, component boundaries, and security headers.
- `/challenge-alignment`: Point-by-point mapping to VORTEXA 3.0 problem statement criteria.

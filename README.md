# TeachSense AI

> **Precision Diagnostic & Differentiated Instruction Co-pilot for Teachers**  
> Built for the **VORTEXA 3.0 Hackathon** | Official Repository: [https://github.com/vignesh06-OG/teachsense-ai](https://github.com/vignesh06-OG/teachsense-ai)

---

## 🌟 Overview
**TeachSense AI** goes beyond percentage scores to detect **why** students fail assessments. By diagnosing root conceptual misconceptions, clustering students into differentiated cohorts, generating targeted remedial materials with mandatory teacher approval, and quantifying efficacy through before/after delta analysis, TeachSense AI empowers educators to close achievement gaps rapidly.

---

## 🎯 Key Capabilities
1. **Misconception Classification Engine**: Deep cognitive error detection with dual-tier LLM + deterministic heuristic fallback.
2. **Confidence-Ranked Review Queue**: Flags classifications $< 85\%$ confidence for rapid teacher human-in-the-loop validation.
3. **Semantic Student Grouper**: Clusters students by shared cognitive misconceptions instead of arbitrary grade thresholds.
4. **Targeted Material Synthesis with Approval Gate**: Produces remedial worksheets, counter-examples, and formative checks gated by teacher sign-off.
5. **Before/After Delta Analyzer**: Measures effect size (Cohen's $d$) and normalized learning gain ($g$).
6. **3D Interactive Experience**: React Three Fiber procedural neural classroom hero with GSAP kinetic typography.

---

## 🔒 Evaluation Evidence & Non-Negotiables
- **Live Quality & Benchmark Page**: [`/quality`](http://localhost:3000/quality)
- **Interactive System Architecture**: [`/architecture`](http://localhost:3000/architecture)
- **VORTEXA 3.0 Challenge Alignment Matrix**: [`/challenge-alignment`](http://localhost:3000/challenge-alignment)
- **Zero Paid API Required**: Runs 100% offline out-of-the-box with deterministic rule engines.
- **Pure Fictional Data**: Strict compliance with student privacy best practices (zero real PII).
- **Vitest Coverage Target**: $\ge 95\%$ across all diagnostic engines and schemas.
- **Enterprise Security Headers**: Strict CSP, HSTS, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`).

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Setup & Installation
```bash
git clone https://github.com/vignesh06-OG/teachsense-ai.git
cd teachsense-ai
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests
```bash
npm run test
npm run test:coverage
```
Coverage report will show $\ge 95\%$ coverage across all modules.

---

## 🏗️ Repository Layout
```
teachsense-ai/
├── app/
│   ├── (marketing)/page.tsx      # 3D hero & kinetic typography
│   ├── dashboard/                # Teacher workspace & review suites
│   ├── quality/page.tsx          # Commit #1 evaluation evidence
│   ├── architecture/page.tsx     # Commit #1 system topology
│   ├── challenge-alignment/page.tsx # Commit #1 PS matrix
│   ├── api/                      # Diagnostic and grouping route endpoints
│   ├── robots.ts                 # Commit #1 crawler directives
│   └── sitemap.ts                # Commit #1 sitemap index
├── lib/
│   ├── engines/                  # Misconception, grouper, materials, delta engines
│   ├── demo-data/                # Fictional classroom datasets
│   └── validators/               # Zod assessment schemas
├── components/                   # UI, Three.js, Charts, Review Queue
├── __tests__/                    # Vitest test matrix (≥95% coverage)
├── docs/                         # PRD, SECURITY, ACCESSIBILITY, TESTING, etc.
├── next.config.ts                # Strict security headers
└── vitest.config.ts              # Test runner configuration
```

---

## 📜 License
MIT © TeachSense AI Team — VORTEXA 3.0 Hackathon.

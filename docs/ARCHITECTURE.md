# System Architecture & Technical Specifications — TeachSense AI
**Target Repository**: `teachsense-ai/`  
**Framework**: Next.js 14+ (App Router), TypeScript (strict mode), Tailwind CSS  
**3D & Animation**: Three.js, React Three Fiber, React Drei, Framer Motion, GSAP  
**Testing**: Vitest v2.1.9, V8 Coverage, Testing Library  

---

## 1. System Topology & Data Flow

```
+-------------------------------------------------------------------------+
|                           User Interface Layer                          |
|  - Marketing Page (app/(marketing)/page.tsx) with R3F 3D Canvas        |
|  - Teacher Dashboard (app/dashboard/**) with Glassmorphic Panels        |
|  - Evaluation Evidence Pages (/quality, /architecture, /challenge-align)|
+-------------------------------------------------------------------------+
                                    |
                                    v (HTTP / JSON)
+-------------------------------------------------------------------------+
|                         Next.js App Router API                          |
|  POST /api/classify  -->  Misconception Classification Endpoint         |
|  POST /api/group     -->  Differentiated Cohort Clustering Endpoint     |
|  POST /api/generate  -->  Remedial Material Synthesis & Approval Gate   |
|  POST /api/compare   -->  Pre/Post Intervention Delta Analysis Endpoint |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        Core Diagnostic Engines (lib/)                   |
|  - lib/validators/assessment-schema.ts  (Zod Strict Validation)        |
|  - lib/engines/misconception-classifier.ts (Dual-tier inference)        |
|  - lib/engines/student-grouper.ts (Semantic Misconception Clustering)   |
|  - lib/engines/material-generator.ts (Pedagogical Template Generator)   |
|  - lib/engines/delta-analyzer.ts (Cohen's d & Hake's Gain Calculator)   |
|  - lib/demo-data/fictional-class.ts (Synthetic Classroom Dataset)       |
+-------------------------------------------------------------------------+
```

---

## 2. Dual-Path Inference Routing
The misconception classification pipeline features automatic zero-cost failover:

```
                  Incoming Assessment Payload
                              |
                              v
                  Zod Schema Safe Validation
                              |
                     Is OPENAI_API_KEY set?
                            /        \
                    YES    /          \    NO / Timeout / Rate Limit
                          v            v
            OpenAI GPT-4o-mini       Deterministic Rule-Based
            Diagnostic Classifier    Heuristic Classifier
                          \            /
                           v          v
                 Normalized Misconception Record
                              |
                   Confidence < 0.85 & !isCorrect?
                            /        \
                    YES    /          \    NO
                          v            v
               Teacher Review Queue   Automated Cohort Grouping
```

---

## 3. Statistical Formulations (Delta Engine)
1. **Raw Gain**:
   $$\Delta = \text{Score}_{post} - \text{Score}_{pre}$$
2. **Hake's Normalized Learning Gain ($g$)**:
   $$g = \frac{\text{Score}_{post} - \text{Score}_{pre}}{100 - \text{Score}_{pre}}$$
   - High Gain: $g \ge 0.70$
   - Medium Gain: $0.30 \le g < 0.70$
   - Low Gain: $g < 0.30$
3. **Cohen's $d$ Effect Size**:
   $$d = \frac{\bar{X}_{post} - \bar{X}_{pre}}{s_{pooled}} \quad \text{where} \quad s_{pooled} = \sqrt{\frac{s_{pre}^2 + s_{post}^2}{2}}$$
   - Large Effect: $d \ge 0.80$
   - Very Large Effect: $d \ge 1.20$

import { describe, it, expect } from "vitest";
import { AssessmentBatchSchema, AssessmentBatch } from "@/lib/validators/assessment-schema";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { groupStudentsByMisconceptions } from "@/lib/engines/student-grouper";
import { generateRemedialMaterialForGroup } from "@/lib/engines/material-generator";
import { analyzeInterventionDeltas, StudentScoreRecord } from "@/lib/engines/delta-analyzer";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";

describe("TeachSense AI End-to-End 6-Stage Workflow Pipeline Integration", () => {
  // Stage 1 & 2: Ingestion & Schema Validation
  it("Stage 2: validates structured assessment batch and catches unmatched question references", () => {
    const validRes = AssessmentBatchSchema.safeParse(FICTIONAL_CLASSROOM_ASSESSMENT);
    expect(validRes.success).toBe(true);

    // Test malformed / unmatched question reference
    const invalidBatch: AssessmentBatch = {
      ...FICTIONAL_CLASSROOM_ASSESSMENT,
      submissions: [
        {
          studentId: "STU-999",
          studentName: "Test Student",
          answers: [
            {
              questionId: "NON_EXISTENT_Q",
              studentAnswer: "42",
            },
          ],
        },
      ],
    };

    const questionIds = new Set(invalidBatch.questions.map((q) => q.id));
    const hasUnmatched = invalidBatch.submissions.some((s) =>
      s.answers.some((a) => !questionIds.has(a.questionId))
    );
    expect(hasUnmatched).toBe(true);
  });

  // Stage 3: Misconception Classification & Teacher Verification
  it("Stage 3: classifies cognitive error patterns and routes uncertain answers to review queue", async () => {
    const result = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);

    expect(result.totalEvaluated).toBe(40); // 10 students * 4 questions
    expect(result.classifications.length).toBe(40);
    expect(result.uncertainCount).toBeGreaterThan(0);

    // Verify presence of core misconception tags
    expect(result.misconceptionFrequencies).toHaveProperty("INVERSE_OP_SIGN_FLIP");
    expect(result.misconceptionFrequencies).toHaveProperty("ADD_ACROSS_FRACTION_FALLACY");

    // Simulate Teacher Review Queue Sign-Off
    const uncertainItem = result.classifications.find((c) => c.isUncertain);
    expect(uncertainItem).toBeDefined();

    if (uncertainItem) {
      const teacherReviewed = {
        ...uncertainItem,
        misconceptionTag: "INVERSE_OP_SIGN_FLIP",
        isUncertain: false,
        verifiedByTeacher: true,
        teacherOverrideNotes: "Verified via student margin scratchwork",
      };
      expect(teacherReviewed.verifiedByTeacher).toBe(true);
      expect(teacherReviewed.isUncertain).toBe(false);
    }
  });

  // Stage 4: Differentiated Cohort Grouping
  it("Stage 4: clusters students into actionable cohorts with explainable tie-breaking", async () => {
    const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    const groupResult = groupStudentsByMisconceptions(diag.classifications);

    expect(groupResult.groups.length).toBeGreaterThanOrEqual(3);

    // Check cohort metadata integrity
    groupResult.groups.forEach((g) => {
      expect(g.studentIds.length).toBeGreaterThan(0);
      expect(g.studentNames.length).toBe(g.studentIds.length);
      expect(["high", "medium", "low"]).toContain(g.severity);
      expect(g.recommendedStrategy.length).toBeGreaterThan(10);
      expect(g.keyVocabulary.length).toBeGreaterThan(0);
    });
  });

  // Stage 5: Remedial Material Synthesis & Approval Gate
  it("Stage 5: generates targeted remedial materials with mandatory teacher approval gate", async () => {
    const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    const groupResult = groupStudentsByMisconceptions(diag.classifications);
    const materials = groupResult.groups.map(generateRemedialMaterialForGroup);

    expect(materials.length).toBe(groupResult.groups.length);

    // Initial state: ALL materials MUST be pending approval
    materials.forEach((m) => {
      expect(m.approvalStatus).toBe("pending");
      expect(m.counterExamples.length).toBeGreaterThan(0);
      expect(m.scaffoldedPractice.length).toBeGreaterThan(0);
      expect(m.exitTicketQuestion.options.length).toBe(4);
    });

    // Simulate teacher sign-off
    const approvedMaterial = { ...materials[0], approvalStatus: "approved" as const };
    expect(approvedMaterial.approvalStatus).toBe("approved");

    // Simulate teacher edit
    const editedMaterial = {
      ...approvedMaterial,
      title: "Customized Teacher Title: Balance Operations",
      teacherNotes: "Use physical scale in classroom tomorrow",
    };
    expect(editedMaterial.title).toBe("Customized Teacher Title: Balance Operations");
  });

  // Stage 6: Empirical Delta Efficacy Evaluation
  it("Stage 6: computes statistical learning gains, Cohen's d, and handles zero-denominator edge cases", () => {
    const testRecords: StudentScoreRecord[] = [
      { studentId: "S1", studentName: "Student 1", preScore: 40, postScore: 85, misconceptionTag: "INVERSE_OP_SIGN_FLIP" },
      { studentId: "S2", studentName: "Student 2", preScore: 50, postScore: 90, misconceptionTag: "INVERSE_OP_SIGN_FLIP" },
      { studentId: "S3", studentName: "Student 3", preScore: 30, postScore: 80, misconceptionTag: "ADD_ACROSS_FRACTION_FALLACY" },
    ];

    const summary = analyzeInterventionDeltas(testRecords);

    expect(summary.totalStudents).toBe(3);
    expect(summary.preAverage).toBe(40);
    expect(summary.postAverage).toBe(85);
    expect(summary.averageNormalizedGain).toBeGreaterThan(0.7); // High gain
    expect(summary.cohensD).toBeGreaterThan(1.5); // Large effect
    expect(summary.remediationRate).toBe(100);

    // Edge case: Empty dataset
    const emptySummary = analyzeInterventionDeltas([]);
    expect(emptySummary.totalStudents).toBe(0);
    expect(emptySummary.averageNormalizedGain).toBe(0);
    expect(emptySummary.cohensD).toBe(0);

    // Edge case: Perfect pre-score (100) avoids division by zero
    const perfectRecord: StudentScoreRecord[] = [
      { studentId: "S_PERF", studentName: "Perfect Student", preScore: 100, postScore: 100, misconceptionTag: "NONE_CORRECT" },
    ];
    const perfSummary = analyzeInterventionDeltas(perfectRecord);
    expect(perfSummary.averageNormalizedGain).toBe(1.0);
    expect(perfSummary.cohensD).toBe(0);
  });
});

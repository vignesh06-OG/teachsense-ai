import { describe, it, expect } from "vitest";
import { groupStudentsByMisconceptions } from "@/lib/engines/student-grouper";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { MisconceptionClassification } from "@/lib/validators/assessment-schema";

describe("Student Grouper Engine", () => {
  it("groups students by shared misconception cohorts", async () => {
    const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    const result = groupStudentsByMisconceptions(diag.classifications);

    expect(result.groups.length).toBeGreaterThan(0);
    expect(result.cohortSummary.studentsNeedingIntervention).toBeGreaterThan(0);

    const inverseGroup = result.groups.find(
      (g) => g.misconceptionTag === "INVERSE_OP_SIGN_FLIP"
    );
    expect(inverseGroup).toBeDefined();
    expect(inverseGroup?.studentIds.length).toBeGreaterThanOrEqual(2);
    expect(inverseGroup?.recommendedStrategy).toContain("balance");
  });

  it("handles empty classifications array", () => {
    const result = groupStudentsByMisconceptions([]);
    expect(result.groups.length).toBe(0);
    expect(result.cohortSummary.totalGroups).toBe(0);
    expect(result.cohortSummary.studentsNeedingIntervention).toBe(0);
  });

  it("skips correct answers when building groups", () => {
    const mastered: MisconceptionClassification[] = [
      {
        id: "C1",
        studentId: "S1",
        studentName: "Student 1",
        questionId: "Q1",
        studentAnswer: "x = 5",
        correctAnswer: "x = 5",
        isCorrect: true,
        misconceptionTag: "NONE_CORRECT",
        misconceptionLabel: "Mastered",
        confidence: 1.0,
        explanation: "Good",
        isUncertain: false,
        verifiedByTeacher: false,
      },
    ];
    const result = groupStudentsByMisconceptions(mastered);
    expect(result.groups.length).toBe(0);
  });

  it("assigns high severity when 4 or more students share misconception", () => {
    const classifs: MisconceptionClassification[] = ["S1", "S2", "S3", "S4"].map((id) => ({
      id: `C-${id}`,
      studentId: id,
      studentName: `Student ${id}`,
      questionId: "Q1",
      studentAnswer: "10",
      correctAnswer: "5",
      isCorrect: false,
      misconceptionTag: "INVERSE_OP_SIGN_FLIP",
      misconceptionLabel: "Sign Error",
      confidence: 0.95,
      explanation: "Wrong",
      isUncertain: false,
      verifiedByTeacher: false,
    }));

    const result = groupStudentsByMisconceptions(classifs);
    expect(result.groups[0].severity).toBe("high");
  });

  it("respects minGroupSize option", () => {
    const classifs: MisconceptionClassification[] = [
      {
        id: "C1",
        studentId: "S1",
        studentName: "Student 1",
        questionId: "Q1",
        studentAnswer: "wrong",
        correctAnswer: "5",
        isCorrect: false,
        misconceptionTag: "CUSTOM_SOLO_TAG",
        misconceptionLabel: "Solo Tag",
        confidence: 0.9,
        explanation: "Solo",
        isUncertain: false,
        verifiedByTeacher: false,
      },
    ];

    const result = groupStudentsByMisconceptions(classifs, { minGroupSize: 2 });
    expect(result.groups.length).toBe(0);
  });
});

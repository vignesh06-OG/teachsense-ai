import { describe, it, expect } from "vitest";
import {
  StudentAnswerSchema,
  StudentSubmissionSchema,
  QuestionSchema,
  AssessmentBatchSchema,
  MisconceptionClassificationSchema,
  StudentGroupSchema,
  RemedialMaterialSchema,
  StudentDeltaSchema,
  DeltaAnalysisSummarySchema,
} from "@/lib/validators/assessment-schema";

describe("Assessment Schema Validators", () => {
  it("validates valid student answer", () => {
    const valid = { questionId: "Q1", studentAnswer: "x = 10", workShown: "2x = 20" };
    expect(StudentAnswerSchema.parse(valid)).toEqual(valid);
  });

  it("rejects empty student answer", () => {
    const invalid = { questionId: "Q1", studentAnswer: "" };
    expect(() => StudentAnswerSchema.parse(invalid)).toThrow();
  });

  it("validates student submission with multiple answers", () => {
    const submission = {
      studentId: "STU-001",
      studentName: "Alex Rivera",
      answers: [{ questionId: "Q1", studentAnswer: "x = 5" }],
    };
    expect(StudentSubmissionSchema.parse(submission)).toEqual(submission);
  });

  it("rejects student submission with empty answers", () => {
    const invalid = {
      studentId: "STU-001",
      studentName: "Alex Rivera",
      answers: [],
    };
    expect(() => StudentSubmissionSchema.parse(invalid)).toThrow();
  });

  it("validates question schema", () => {
    const question = {
      id: "Q1",
      prompt: "Solve 2x = 10",
      topic: "Equations",
      correctAnswer: "5",
    };
    const parsed = QuestionSchema.parse(question);
    expect(parsed.id).toBe("Q1");
  });

  it("validates full assessment batch schema", () => {
    const batch = {
      assessmentId: "TEST-01",
      assessmentTitle: "Unit Quiz",
      questions: [{ id: "Q1", prompt: "2x = 10", topic: "Eq", correctAnswer: "5" }],
      submissions: [
        {
          studentId: "S1",
          studentName: "Student 1",
          answers: [{ questionId: "Q1", studentAnswer: "5" }],
        },
      ],
    };
    const parsed = AssessmentBatchSchema.parse(batch);
    expect(parsed.assessmentId).toBe("TEST-01");
    expect(parsed.subject).toBe("Mathematics"); // default
  });

  it("validates misconception classification schema", () => {
    const item = {
      id: "CLS-1",
      studentId: "S1",
      studentName: "Alex",
      questionId: "Q1",
      studentAnswer: "x = 10",
      correctAnswer: "x = 5",
      isCorrect: false,
      misconceptionTag: "INVERSE_OP_SIGN_FLIP",
      misconceptionLabel: "Sign Error",
      confidence: 0.95,
      explanation: "Added instead of subtracted",
      isUncertain: false,
    };
    const parsed = MisconceptionClassificationSchema.parse(item);
    expect(parsed.isUncertain).toBe(false);
    expect(parsed.verifiedByTeacher).toBe(false);
  });

  it("validates student group schema", () => {
    const group = {
      id: "GRP-1",
      name: "Sign Error Group",
      misconceptionTag: "INVERSE_OP_SIGN_FLIP",
      misconceptionLabel: "Sign Error",
      severity: "high" as const,
      studentIds: ["S1", "S2"],
      studentNames: ["Alex", "Jordan"],
      recommendedStrategy: "Balance Scale Metaphor",
      keyVocabulary: ["Inverse", "Balance"],
      targetedObjective: "Isolate variables",
    };
    const parsed = StudentGroupSchema.parse(group);
    expect(parsed.severity).toBe("high");
  });

  it("validates remedial material schema", () => {
    const material = {
      id: "MAT-1",
      groupId: "GRP-1",
      groupName: "Sign Error Group",
      misconceptionTag: "INVERSE_OP_SIGN_FLIP",
      title: "Balance Scale Lesson",
      targetConcept: "Linear Equations",
      conceptualReframing: "Think of an equation as a balance scale.",
      counterExamples: [
        { flawedThinking: "2x+5=15 => 2x=20", correctedApproach: "2x=10", explanation: "Undo addition" },
      ],
      scaffoldedPractice: [{ problem: "3x+6=18", hint: "Subtract 6", solution: "x = 4" }],
      exitTicketQuestion: {
        prompt: "Solve 4x + 8 = 24",
        options: ["x = 4", "x = 8", "x = 2", "x = 6"],
        correctIndex: 0,
        diagnosticDistractorNote: "Option B is sign error",
      },
    };
    const parsed = RemedialMaterialSchema.parse(material);
    expect(parsed.approvalStatus).toBe("pending");
  });

  it("validates student delta and summary schemas", () => {
    const delta = {
      studentId: "S1",
      studentName: "Alex",
      preScore: 40,
      postScore: 80,
      rawGain: 40,
      normalizedGain: 0.667,
      misconceptionTag: "INVERSE_OP_SIGN_FLIP",
      status: "remediated" as const,
    };
    expect(StudentDeltaSchema.parse(delta)).toEqual(delta);

    const summary = {
      totalStudents: 1,
      preAverage: 40,
      postAverage: 80,
      averageNormalizedGain: 0.667,
      cohensD: 1.45,
      remediationRate: 100,
      cohortDeltas: [delta],
    };
    expect(DeltaAnalysisSummarySchema.parse(summary)).toEqual(summary);
  });
});

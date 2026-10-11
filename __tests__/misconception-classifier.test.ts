import { describe, it, expect } from "vitest";
import {
  classifyWithHeuristics,
  classifyAssessmentBatch,
} from "@/lib/engines/misconception-classifier";
import { FICTIONAL_CLASSROOM_ASSESSMENT, KNOWN_MISCONCEPTIONS } from "@/lib/demo-data/fictional-class";
import { Question, AssessmentBatch } from "@/lib/validators/assessment-schema";

describe("Misconception Classifier Engine", () => {
  const q1: Question = {
    id: "Q1",
    prompt: "Solve 2x + 5 = 15",
    topic: "Linear Equations",
    correctAnswer: "x = 5",
  };

  const q2: Question = {
    id: "Q2",
    prompt: "Compute 1/3 + 1/4",
    topic: "Fractions",
    correctAnswer: "7/12",
  };

  const q3: Question = {
    id: "Q3",
    prompt: "Solve 3(x - 2) = 12",
    topic: "Distributive",
    correctAnswer: "x = 6",
  };

  const q4: Question = {
    id: "Q4",
    prompt: "Compare -8 and -3",
    topic: "Integers",
    correctAnswer: "-3",
  };

  it("identifies correct answer for Q1 with 1.0 confidence", () => {
    const res = classifyWithHeuristics(q1, "x = 5");
    expect(res.isCorrect).toBe(true);
    expect(res.confidence).toBe(1.0);
    expect(res.misconceptionTag).toBe("NONE_CORRECT");
  });

  it("classifies Q1 inverse operation sign error", () => {
    const res = classifyWithHeuristics(q1, "x = 10", "2x = 20");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.INVERSE_OP_SIGN_FLIP.tag);
    expect(res.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("flags Q1 ambiguous answer as uncertain with confidence < 0.85", () => {
    const res = classifyWithHeuristics(q1, "x = 7");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag);
    expect(res.confidence).toBeLessThan(0.85);
  });

  it("classifies Q2 add-across fraction fallacy", () => {
    const res = classifyWithHeuristics(q2, "2/7");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.ADD_ACROSS_FRACTION_FALLACY.tag);
    expect(res.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("classifies Q2 fraction subtraction confusion via work shown", () => {
    const res = classifyWithHeuristics(q2, "1/12", "I decided to subtract the two");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe("FRACTION_SUBTRACTION_CONFUSION");
  });

  it("classifies Q2 ambiguous response", () => {
    const res = classifyWithHeuristics(q2, "9/99");
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag);
    expect(res.confidence).toBeLessThan(0.85);
  });

  it("classifies Q3 distributive property error", () => {
    const res = classifyWithHeuristics(q3, "x = 4.67");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.DISTRIBUTION_DROP.tag);
  });

  it("classifies Q3 ambiguous response", () => {
    const res = classifyWithHeuristics(q3, "x = 99");
    expect(res.confidence).toBeLessThan(0.85);
  });

  it("classifies Q4 negative magnitude error", () => {
    const res = classifyWithHeuristics(q4, "-8");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.NEGATIVE_MAGNITUDE_CONFUSION.tag);
  });

  it("classifies Q4 ambiguous response", () => {
    const res = classifyWithHeuristics(q4, "0");
    expect(res.confidence).toBeLessThan(0.85);
  });

  it("handles unknown question fallback gracefully", () => {
    const unknownQ: Question = {
      id: "Q99",
      prompt: "Custom unknown question",
      topic: "Calculus",
      correctAnswer: "e^x",
    };
    const res = classifyWithHeuristics(unknownQ, "x^2");
    expect(res.isCorrect).toBe(false);
    expect(res.misconceptionTag).toBe(KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag);
  });

  it("evaluates entire batch and detects uncertain items", async () => {
    const result = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    expect(result.totalEvaluated).toBe(40); // 10 students * 4 questions
    expect(result.uncertainCount).toBeGreaterThan(0);
    expect(result.misconceptionFrequencies[KNOWN_MISCONCEPTIONS.INVERSE_OP_SIGN_FLIP.tag]).toBeGreaterThan(0);
    expect(result.misconceptionFrequencies[KNOWN_MISCONCEPTIONS.ADD_ACROSS_FRACTION_FALLACY.tag]).toBeGreaterThan(0);
  });

  it("handles batch with unmatched question id gracefully", async () => {
    const batchWithMissingQ: AssessmentBatch = {
      ...FICTIONAL_CLASSROOM_ASSESSMENT,
      submissions: [
        {
          studentId: "S-GHOST",
          studentName: "Ghost",
          answers: [{ questionId: "Q_NONEXISTENT", studentAnswer: "foo" }],
        },
      ],
    };
    const result = await classifyAssessmentBatch(batchWithMissingQ);
    expect(result.classifications.length).toBe(0);
  });
});

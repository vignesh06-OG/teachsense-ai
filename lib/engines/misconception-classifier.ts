import {
  AssessmentBatch,
  MisconceptionClassification,
  StudentSubmission,
  Question,
} from "../validators/assessment-schema";
import { KNOWN_MISCONCEPTIONS } from "../demo-data/fictional-class";

export interface ClassificationOptions {
  useMockFallback?: boolean;
  confidenceThreshold?: number; // defaults to 0.85
}

/**
 * Deterministic Local Heuristic Misconception Classifier
 * Runs completely offline without external API dependencies.
 */
export function classifyWithHeuristics(
  question: Question,
  studentAnswer: string,
  workShown?: string
): {
  isCorrect: boolean;
  misconceptionTag: string;
  misconceptionLabel: string;
  confidence: number;
  explanation: string;
} {
  const normAns = studentAnswer.trim().toLowerCase();
  const normCorrect = question.correctAnswer.trim().toLowerCase();
  const normWork = (workShown || "").trim().toLowerCase();

  // 1. Check if directly correct
  if (normAns === normCorrect || normAns.endsWith(normCorrect)) {
    return {
      isCorrect: true,
      misconceptionTag: "NONE_CORRECT",
      misconceptionLabel: "Mastered / Conceptually Sound",
      confidence: 1.0,
      explanation: `Student correctly answered "${question.correctAnswer}" demonstrating valid mastery.`,
    };
  }

  // 2. Q1 Heuristics: 2x + 5 = 15 (Correct: x = 5)
  if (question.id === "Q1") {
    if (normAns.includes("10") || normWork.includes("20")) {
      return {
        isCorrect: false,
        misconceptionTag: KNOWN_MISCONCEPTIONS.INVERSE_OP_SIGN_FLIP.tag,
        misconceptionLabel: KNOWN_MISCONCEPTIONS.INVERSE_OP_SIGN_FLIP.label,
        confidence: 0.96,
        explanation:
          "Added 5 to both sides instead of subtracting (2x = 15 + 5 = 20 => x = 10). Demonstrates inverse operation sign confusion.",
      };
    }
    // Ambiguous guess (e.g., x = 7)
    return {
      isCorrect: false,
      misconceptionTag: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag,
      misconceptionLabel: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.label,
      confidence: 0.65, // Below 0.85 -> triggers review queue
      explanation: `Answer "${studentAnswer}" does not match standard inverse sign error or arithmetic slip. Flagged for teacher review.`,
    };
  }

  // 3. Q2 Heuristics: 1/3 + 1/4 (Correct: 7/12)
  if (question.id === "Q2") {
    if (normAns.includes("2/7") || (normWork.includes("1+1") && normWork.includes("3+4"))) {
      return {
        isCorrect: false,
        misconceptionTag: KNOWN_MISCONCEPTIONS.ADD_ACROSS_FRACTION_FALLACY.tag,
        misconceptionLabel: KNOWN_MISCONCEPTIONS.ADD_ACROSS_FRACTION_FALLACY.label,
        confidence: 0.98,
        explanation:
          "Added numerators (1+1=2) and denominators (3+4=7) directly. Failed to find common denominator.",
      };
    }
    if (normAns.includes("1/12") || normWork.includes("subtract")) {
      return {
        isCorrect: false,
        misconceptionTag: "FRACTION_SUBTRACTION_CONFUSION",
        misconceptionLabel: "Operator Confusion (Subtracted instead of Added)",
        confidence: 0.88,
        explanation: "Correctly converted to common denominator 12, but subtracted (4/12 - 3/12) instead of adding.",
      };
    }
    return {
      isCorrect: false,
      misconceptionTag: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag,
      misconceptionLabel: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.label,
      confidence: 0.68,
      explanation: "Fraction calculation error with non-standard denominator. Routed to review queue.",
    };
  }

  // 4. Q3 Heuristics: 3(x - 2) = 12 (Correct: x = 6)
  if (question.id === "Q3") {
    if (normAns.includes("4.67") || normAns.includes("14/3") || normWork.includes("3x - 2")) {
      return {
        isCorrect: false,
        misconceptionTag: KNOWN_MISCONCEPTIONS.DISTRIBUTION_DROP.tag,
        misconceptionLabel: KNOWN_MISCONCEPTIONS.DISTRIBUTION_DROP.label,
        confidence: 0.95,
        explanation:
          "Distributed 3 to x only, leaving -2 undistributed (3x - 2 = 12 => 3x = 14 => x = 14/3).",
      };
    }
    return {
      isCorrect: false,
      misconceptionTag: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag,
      misconceptionLabel: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.label,
      confidence: 0.70,
      explanation: "Algebraic simplification error outside standard distribution fallacy.",
    };
  }

  // 5. Q4 Heuristics: -8 vs -3 (Correct: -3)
  if (question.id === "Q4") {
    if (normAns.includes("-8")) {
      return {
        isCorrect: false,
        misconceptionTag: KNOWN_MISCONCEPTIONS.NEGATIVE_MAGNITUDE_CONFUSION.tag,
        misconceptionLabel: KNOWN_MISCONCEPTIONS.NEGATIVE_MAGNITUDE_CONFUSION.label,
        confidence: 0.97,
        explanation:
          "Selected -8 over -3 because numerical magnitude 8 > 3. Demonstrates confusion between absolute magnitude and signed order.",
      };
    }
    return {
      isCorrect: false,
      misconceptionTag: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag,
      misconceptionLabel: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.label,
      confidence: 0.72,
      explanation: "Integer comparison reasoning unclear.",
    };
  }

  // Generic fallback
  return {
    isCorrect: false,
    misconceptionTag: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.tag,
    misconceptionLabel: KNOWN_MISCONCEPTIONS.UNKNOWN_AMBIGUOUS.label,
    confidence: 0.60,
    explanation: `Student answered "${studentAnswer}" which deviates from expected answer "${question.correctAnswer}".`,
  };
}

/**
 * Classifies an entire assessment batch, returning structured classification records
 * and flagging uncertain items (confidence < 0.85) for the teacher review queue.
 */
export async function classifyAssessmentBatch(
  batch: AssessmentBatch,
  options: ClassificationOptions = {}
): Promise<{
  classifications: MisconceptionClassification[];
  uncertainCount: number;
  totalEvaluated: number;
  misconceptionFrequencies: Record<string, number>;
}> {
  const threshold = options.confidenceThreshold ?? 0.85;
  const questionMap = new Map<string, Question>();
  for (const q of batch.questions) {
    questionMap.set(q.id, q);
  }

  const classifications: MisconceptionClassification[] = [];
  const frequencies: Record<string, number> = {};
  let uncertainCount = 0;

  for (const sub of batch.submissions) {
    for (const ans of sub.answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const result = classifyWithHeuristics(q, ans.studentAnswer, ans.workShown);
      const isUncertain = result.confidence < threshold && !result.isCorrect;

      if (isUncertain) {
        uncertainCount++;
      }

      if (!result.isCorrect) {
        frequencies[result.misconceptionTag] = (frequencies[result.misconceptionTag] || 0) + 1;
      }

      classifications.push({
        id: `CLS-${sub.studentId}-${q.id}`,
        studentId: sub.studentId,
        studentName: sub.studentName,
        questionId: q.id,
        studentAnswer: ans.studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: result.isCorrect,
        misconceptionTag: result.misconceptionTag,
        misconceptionLabel: result.misconceptionLabel,
        confidence: result.confidence,
        explanation: result.explanation,
        isUncertain,
        verifiedByTeacher: false,
      });
    }
  }

  return {
    classifications,
    uncertainCount,
    totalEvaluated: classifications.length,
    misconceptionFrequencies: frequencies,
  };
}

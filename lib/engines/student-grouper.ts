import {
  MisconceptionClassification,
  StudentGroup,
} from "../validators/assessment-schema";
import { KNOWN_MISCONCEPTIONS } from "../demo-data/fictional-class";

export interface GroupingOptions {
  minGroupSize?: number;
  maxGroupSize?: number;
  prioritizeSeverity?: boolean;
}

export interface GroupingResult {
  groups: StudentGroup[];
  ungroupedStudents: { studentId: string; studentName: string }[];
  cohortSummary: {
    totalGroups: number;
    mostPrevalentMisconception: string;
    studentsNeedingIntervention: number;
  };
}

/**
 * Clusters students into actionable intervention cohorts based on dominant cognitive misconceptions.
 */
export function groupStudentsByMisconceptions(
  classifications: MisconceptionClassification[],
  options: GroupingOptions = {}
): GroupingResult {
  const minSize = options.minGroupSize ?? 1;

  // 1. Group classifications by misconception tag (excluding mastered/correct items)
  const misconceptionMap = new Map<
    string,
    {
      students: Map<string, string>; // studentId -> studentName
      count: number;
    }
  >();

  const allInterventionStudents = new Set<string>();

  for (const c of classifications) {
    if (c.isCorrect || c.misconceptionTag === "NONE_CORRECT") {
      continue;
    }

    allInterventionStudents.add(c.studentId);

    if (!misconceptionMap.has(c.misconceptionTag)) {
      misconceptionMap.set(c.misconceptionTag, {
        students: new Map<string, string>(),
        count: 0,
      });
    }

    const entry = misconceptionMap.get(c.misconceptionTag)!;
    entry.students.set(c.studentId, c.studentName);
    entry.count += 1;
  }

  // 2. Synthesize structured cohorts
  const groups: StudentGroup[] = [];
  let maxCount = 0;
  let dominantTag = "None";

  misconceptionMap.forEach((entry, tag) => {
    const studentIds = Array.from(entry.students.keys());
    const studentNames = Array.from(entry.students.values());

    if (studentIds.length < minSize) {
      return;
    }

    if (entry.count > maxCount) {
      maxCount = entry.count;
      dominantTag = tag;
    }

    // Determine severity
    let severity: "high" | "medium" | "low" = "medium";
    if (studentIds.length >= 4) {
      severity = "high";
    } else if (studentIds.length <= 1) {
      severity = "low";
    }

    // Lookup metadata or generate fallback
    const meta = KNOWN_MISCONCEPTIONS[tag as keyof typeof KNOWN_MISCONCEPTIONS];
    const label = meta ? meta.label : `${tag.replace(/_/g, " ")}`;
    const strategy = meta
      ? meta.correctiveStrategy
      : "Conduct structured peer discussion and targeted diagnostic step-by-step reviews.";

    const vocabularyMap: Record<string, string[]> = {
      INVERSE_OP_SIGN_FLIP: ["Inverse Operations", "Balance Scale", "Equality", "Zero Pairs"],
      ADD_ACROSS_FRACTION_FALLACY: ["Common Denominator", "Fraction Tiles", "Unit Fraction", "Partition"],
      DISTRIBUTION_DROP: ["Distributive Property", "Area Model", "Coefficient", "Parentheses"],
      NEGATIVE_MAGNITUDE_CONFUSION: ["Number Line", "Magnitude", "Signed Integers", "Absolute Value"],
      FRACTION_SUBTRACTION_CONFUSION: ["Operator Order", "Numerator Difference", "Common Unit"],
    };

    const keyVocabulary = vocabularyMap[tag] || ["Step Consistency", "Verification", "Properties of Operations"];

    const objectiveMap: Record<string, string> = {
      INVERSE_OP_SIGN_FLIP: "Apply inverse operations systematically to isolate variables while maintaining algebraic equivalence.",
      ADD_ACROSS_FRACTION_FALLACY: "Identify and construct common denominators before performing fractional addition.",
      DISTRIBUTION_DROP: "Model and apply the distributive property across all terms within binomial brackets.",
      NEGATIVE_MAGNITUDE_CONFUSION: "Order and compare rational integers with precision using geometric number lines.",
    };

    const targetedObjective = objectiveMap[tag] || `Remediate ${label} through targeted problem-solving.`;

    groups.push({
      id: `GRP-${tag}`,
      name: `Cohort ${groups.length + 1}: ${label}`,
      misconceptionTag: tag,
      misconceptionLabel: label,
      severity,
      studentIds,
      studentNames,
      recommendedStrategy: strategy,
      keyVocabulary,
      targetedObjective,
    });
  });

  // Sort groups by severity (high -> medium -> low)
  const severityOrder = { high: 0, medium: 1, low: 2 };
  groups.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    groups,
    ungroupedStudents: [],
    cohortSummary: {
      totalGroups: groups.length,
      mostPrevalentMisconception: dominantTag,
      studentsNeedingIntervention: allInterventionStudents.size,
    },
  };
}

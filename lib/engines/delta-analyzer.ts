import {
  StudentDelta,
  DeltaAnalysisSummary,
} from "../validators/assessment-schema";

export interface StudentScoreRecord {
  studentId: string;
  studentName: string;
  preScore: number; // 0 - 100
  postScore: number; // 0 - 100
  misconceptionTag: string;
}

/**
 * Computes standard deviation of a dataset
 */
function standardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Evaluates Pre- vs Post-Intervention learning gains, computing Hake's normalized gain (g),
 * Cohen's d effect size, and misconception remediation rates.
 */
export function analyzeInterventionDeltas(records: StudentScoreRecord[]): DeltaAnalysisSummary {
  if (records.length === 0) {
    return {
      totalStudents: 0,
      preAverage: 0,
      postAverage: 0,
      averageNormalizedGain: 0,
      cohensD: 0,
      remediationRate: 0,
      cohortDeltas: [],
    };
  }

  const preScores: number[] = [];
  const postScores: number[] = [];
  let totalNormGain = 0;
  let remediatedCount = 0;

  const cohortDeltas: StudentDelta[] = records.map((r) => {
    preScores.push(r.preScore);
    postScores.push(r.postScore);

    const rawGain = r.postScore - r.preScore;

    // Hake's Normalized Gain: g = (post - pre) / (100 - pre)
    let normalizedGain = 0;
    if (r.preScore >= 100) {
      normalizedGain = r.postScore >= 100 ? 1.0 : 0.0;
    } else {
      normalizedGain = rawGain / (100 - r.preScore);
    }
    // Clamp normalized gain between -1 and 1
    normalizedGain = Math.max(-1, Math.min(1, Number(normalizedGain.toFixed(3))));
    totalNormGain += normalizedGain;

    let status: "remediated" | "partial_progress" | "needs_follow_up" = "needs_follow_up";
    if (r.postScore >= 80 && rawGain > 15) {
      status = "remediated";
      remediatedCount++;
    } else if (rawGain > 0) {
      status = "partial_progress";
    }

    return {
      studentId: r.studentId,
      studentName: r.studentName,
      preScore: r.preScore,
      postScore: r.postScore,
      rawGain,
      normalizedGain,
      misconceptionTag: r.misconceptionTag,
      status,
    };
  });

  const preAvg = preScores.reduce((a, b) => a + b, 0) / preScores.length;
  const postAvg = postScores.reduce((a, b) => a + b, 0) / postScores.length;
  const avgNormGain = Number((totalNormGain / records.length).toFixed(3));

  // Cohen's d: (mean2 - mean1) / pooled_sd
  const sdPre = standardDeviation(preScores);
  const sdPost = standardDeviation(postScores);
  const pooledSd = Math.sqrt((Math.pow(sdPre, 2) + Math.pow(sdPost, 2)) / 2);
  const cohensD = pooledSd > 0 ? Number(((postAvg - preAvg) / pooledSd).toFixed(2)) : 0;

  const remediationRate = Number(((remediatedCount / records.length) * 100).toFixed(1));

  return {
    totalStudents: records.length,
    preAverage: Number(preAvg.toFixed(1)),
    postAverage: Number(postAvg.toFixed(1)),
    averageNormalizedGain: avgNormGain,
    cohensD,
    remediationRate,
    cohortDeltas,
  };
}

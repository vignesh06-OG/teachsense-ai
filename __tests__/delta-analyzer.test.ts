import { describe, it, expect } from "vitest";
import {
  analyzeInterventionDeltas,
  StudentScoreRecord,
} from "@/lib/engines/delta-analyzer";

describe("Delta Analyzer Efficacy Engine", () => {
  it("calculates learning gain metrics accurately", () => {
    const records: StudentScoreRecord[] = [
      { studentId: "S1", studentName: "Alex", preScore: 40, postScore: 80, misconceptionTag: "SIGN_FLIP" },
      { studentId: "S2", studentName: "Jordan", preScore: 50, postScore: 90, misconceptionTag: "SIGN_FLIP" },
      { studentId: "S3", studentName: "Casey", preScore: 60, postScore: 85, misconceptionTag: "FRACTION" },
    ];

    const summary = analyzeInterventionDeltas(records);

    expect(summary.totalStudents).toBe(3);
    expect(summary.preAverage).toBe(50);
    expect(summary.postAverage).toBe(85);
    expect(summary.averageNormalizedGain).toBeGreaterThan(0.6);
    expect(summary.cohensD).toBeGreaterThan(1.0); // large effect size
    expect(summary.cohortDeltas.every((d) => d.status === "remediated")).toBe(true);
  });

  it("handles single student dataset correctly", () => {
    const single: StudentScoreRecord[] = [
      { studentId: "S1", studentName: "Alex", preScore: 40, postScore: 80, misconceptionTag: "SIGN_FLIP" },
    ];
    const summary = analyzeInterventionDeltas(single);
    expect(summary.totalStudents).toBe(1);
    expect(summary.cohensD).toBe(0); // standard deviation on single student returns 0
  });

  it("handles empty record sets gracefully", () => {
    const summary = analyzeInterventionDeltas([]);
    expect(summary.totalStudents).toBe(0);
    expect(summary.preAverage).toBe(0);
    expect(summary.postAverage).toBe(0);
    expect(summary.averageNormalizedGain).toBe(0);
    expect(summary.cohensD).toBe(0);
    expect(summary.remediationRate).toBe(0);
    expect(summary.cohortDeltas.length).toBe(0);
  });

  it("handles preScore = 100 without division by zero errors", () => {
    const perfect: StudentScoreRecord[] = [
      { studentId: "S1", studentName: "Taylor", preScore: 100, postScore: 100, misconceptionTag: "NONE" },
      { studentId: "S2", studentName: "Morgan", preScore: 100, postScore: 90, misconceptionTag: "NONE" },
    ];
    const summary = analyzeInterventionDeltas(perfect);
    expect(summary.cohortDeltas[0].normalizedGain).toBe(1.0);
    expect(summary.cohortDeltas[1].normalizedGain).toBe(0.0);
  });

  it("classifies partial progress and needs follow up accurately", () => {
    const mixed: StudentScoreRecord[] = [
      { studentId: "S1", studentName: "Avery", preScore: 30, postScore: 40, misconceptionTag: "MAGNITUDE" }, // gain 10 (<15)
      { studentId: "S2", studentName: "Riley", preScore: 50, postScore: 50, misconceptionTag: "MAGNITUDE" }, // gain 0
    ];
    const summary = analyzeInterventionDeltas(mixed);
    expect(summary.cohortDeltas[0].status).toBe("partial_progress");
    expect(summary.cohortDeltas[1].status).toBe("needs_follow_up");
  });
});

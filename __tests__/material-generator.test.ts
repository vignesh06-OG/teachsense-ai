import { describe, it, expect } from "vitest";
import { generateRemedialMaterialForGroup } from "@/lib/engines/material-generator";
import { StudentGroup } from "@/lib/validators/assessment-schema";

describe("Material Generator Engine", () => {
  const baseGroup: StudentGroup = {
    id: "GRP-TEST",
    name: "Test Group",
    misconceptionTag: "INVERSE_OP_SIGN_FLIP",
    misconceptionLabel: "Sign Error",
    severity: "high",
    studentIds: ["S1", "S2"],
    studentNames: ["Alex", "Jordan"],
    recommendedStrategy: "Balance scale",
    keyVocabulary: ["Inverse", "Equality"],
    targetedObjective: "Isolate variable",
  };

  it("generates approval-gated remedial material for INVERSE_OP_SIGN_FLIP", () => {
    const mat = generateRemedialMaterialForGroup(baseGroup);
    expect(mat.approvalStatus).toBe("pending");
    expect(mat.groupId).toBe("GRP-TEST");
    expect(mat.counterExamples.length).toBeGreaterThan(0);
    expect(mat.scaffoldedPractice.length).toBeGreaterThan(0);
    expect(mat.exitTicketQuestion.options.length).toBe(4);
    expect(mat.title).toContain("Inverse Operations");
  });

  it("generates material for ADD_ACROSS_FRACTION_FALLACY", () => {
    const fractionGroup: StudentGroup = {
      ...baseGroup,
      id: "GRP-FRAC",
      misconceptionTag: "ADD_ACROSS_FRACTION_FALLACY",
      misconceptionLabel: "Fraction Fallacy",
    };
    const mat = generateRemedialMaterialForGroup(fractionGroup);
    expect(mat.title).toContain("Fraction Partitioning");
    expect(mat.counterExamples[0].flawedThinking).toContain("1/3 + 1/4");
    expect(mat.exitTicketQuestion.diagnosticDistractorNote).toContain("add-across");
  });

  it("generates material for DISTRIBUTION_DROP", () => {
    const distGroup: StudentGroup = {
      ...baseGroup,
      id: "GRP-DIST",
      misconceptionTag: "DISTRIBUTION_DROP",
      misconceptionLabel: "Distributive Property Drop",
    };
    const mat = generateRemedialMaterialForGroup(distGroup);
    expect(mat.title).toContain("Geometric Area Model");
    expect(mat.counterExamples[0].flawedThinking).toContain("3(x - 2)");
  });

  it("handles unknown or custom misconception tag with default pedagogical template", () => {
    const customGroup: StudentGroup = {
      ...baseGroup,
      id: "GRP-CUSTOM",
      misconceptionTag: "NON_STANDARD_ERROR",
      misconceptionLabel: "Custom Geometry Error",
    };
    const mat = generateRemedialMaterialForGroup(customGroup);
    expect(mat.approvalStatus).toBe("pending");
    expect(mat.title).toContain("Custom Geometry Error");
    expect(mat.scaffoldedPractice.length).toBeGreaterThan(0);
  });
});

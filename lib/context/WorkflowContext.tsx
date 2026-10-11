"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AssessmentBatch,
  MisconceptionClassification,
  StudentGroup,
  RemedialMaterial,
  DeltaAnalysisSummary,
} from "@/lib/validators/assessment-schema";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { groupStudentsByMisconceptions } from "@/lib/engines/student-grouper";
import { generateRemedialMaterialForGroup } from "@/lib/engines/material-generator";
import { analyzeInterventionDeltas, StudentScoreRecord } from "@/lib/engines/delta-analyzer";

export interface WorkflowStage {
  id: string;
  name: string;
  shortLabel: string;
  path: string;
  description: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: "overview", name: "Overview", shortLabel: "Overview", path: "/dashboard", description: "Classroom diagnostic status & analytics" },
  { id: "upload", name: "Upload Assessment", shortLabel: "Upload", path: "/dashboard/upload", description: "Assessment sheet and scratchwork ingestion" },
  { id: "classify", name: "Misconception Diagnosis", shortLabel: "Classify", path: "/dashboard/classify", description: "Cognitive error classification & review queue" },
  { id: "groups", name: "Differentiated Cohorts", shortLabel: "Groups", path: "/dashboard/groups", description: "Clustering by shared root misconceptions" },
  { id: "materials", name: "Remedial Materials", shortLabel: "Materials", path: "/dashboard/materials", description: "Targeted worksheets with teacher approval gate" },
  { id: "compare", name: "Efficacy Delta", shortLabel: "Compare", path: "/dashboard/compare", description: "Pre/post intervention statistical learning gain" },
];

export type MascotState =
  | "idle"
  | "cursor_tracking"
  | "noticing"
  | "pointing"
  | "thinking"
  | "error"
  | "success";

interface WorkflowContextType {
  currentStageIndex: number;
  stages: WorkflowStage[];
  completedStages: number[];
  canAdvance: boolean;
  unresolvedReviewCount: number;
  pendingApprovalCount: number;
  assessmentBatch: AssessmentBatch;
  classifications: MisconceptionClassification[];
  groups: StudentGroup[];
  materials: RemedialMaterial[];
  deltaSummary: DeltaAnalysisSummary | null;
  // Actions
  loadDemoClassroom: () => Promise<void>;
  updateAssessmentBatch: (batch: AssessmentBatch) => Promise<void>;
  verifyClassification: (id: string, newTag?: string, notes?: string) => void;
  approveMaterial: (id: string) => void;
  rejectMaterial: (id: string) => void;
  continueToNextStage: () => void;
  goToPreviousStage: () => void;
  goToStage: (index: number) => void;
  // Mascot event triggers
  mascotState: MascotState;
  mascotMessage: string;
  mascotTargetId: string | null;
  setMascotState: (state: MascotState) => void;
  triggerMascotError: (message: string, targetId?: string) => void;
  triggerMascotSuccess: (message: string) => void;
  triggerMascotThinking: (message: string) => void;
  dismissMascot: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const DEMO_PRE_POST_RECORDS: StudentScoreRecord[] = [
  { studentId: "STU-001", studentName: "Alex Rivera (Demo)", preScore: 45, postScore: 85, misconceptionTag: "INVERSE_OP_SIGN_FLIP" },
  { studentId: "STU-002", studentName: "Jordan Blake (Demo)", preScore: 50, postScore: 80, misconceptionTag: "INVERSE_OP_SIGN_FLIP" },
  { studentId: "STU-003", studentName: "Casey Chen (Demo)", preScore: 40, postScore: 90, misconceptionTag: "ADD_ACROSS_FRACTION_FALLACY" },
  { studentId: "STU-004", studentName: "Morgan Davis (Demo)", preScore: 35, postScore: 85, misconceptionTag: "ADD_ACROSS_FRACTION_FALLACY" },
  { studentId: "STU-005", studentName: "Taylor Brooks (Demo)", preScore: 60, postScore: 95, misconceptionTag: "DISTRIBUTION_DROP" },
  { studentId: "STU-006", studentName: "Samira Patel (Demo)", preScore: 55, postScore: 90, misconceptionTag: "INVERSE_OP_SIGN_FLIP" },
  { studentId: "STU-007", studentName: "Riley Washington (Demo)", preScore: 30, postScore: 75, misconceptionTag: "UNKNOWN_AMBIGUOUS" },
  { studentId: "STU-008", studentName: "Quinn O'Connor (Demo)", preScore: 70, postScore: 100, misconceptionTag: "DISTRIBUTION_DROP" },
  { studentId: "STU-009", studentName: "Avery Martinez (Demo)", preScore: 40, postScore: 85, misconceptionTag: "NEGATIVE_MAGNITUDE_CONFUSION" },
  { studentId: "STU-010", studentName: "Dakota Lee (Demo)", preScore: 65, postScore: 90, misconceptionTag: "FRACTION_SUBTRACTION_CONFUSION" },
];

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [assessmentBatch, setAssessmentBatch] = useState<AssessmentBatch>(FICTIONAL_CLASSROOM_ASSESSMENT);
  const [classifications, setClassifications] = useState<MisconceptionClassification[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [materials, setMaterials] = useState<RemedialMaterial[]>([]);
  const [deltaSummary, setDeltaSummary] = useState<DeltaAnalysisSummary | null>(null);

  // Mascot state
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("Sensei here! Ready to diagnose your class.");
  const [mascotTargetId, setMascotTargetId] = useState<string | null>(null);

  // Initialize pipeline with fictional demo assessment
  useEffect(() => {
    async function initPipeline() {
      const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
      setClassifications(diag.classifications);

      const groupRes = groupStudentsByMisconceptions(diag.classifications);
      setGroups(groupRes.groups);

      const mats = groupRes.groups.map(generateRemedialMaterialForGroup);
      setMaterials(mats);

      const delta = analyzeInterventionDeltas(DEMO_PRE_POST_RECORDS);
      setDeltaSummary(delta);
    }
    initPipeline();
  }, []);

  // Determine current stage index from route
  const currentStageIndex = Math.max(
    0,
    WORKFLOW_STAGES.findIndex((s) => s.path === pathname)
  );

  // Unresolved counts
  const unresolvedReviewCount = classifications.filter(
    (c) => (c.isUncertain || c.confidence < 0.85) && !c.verifiedByTeacher && !c.isCorrect
  ).length;

  const pendingApprovalCount = materials.filter((m) => m.approvalStatus === "pending").length;

  // Determine completed stages
  const completedStages: number[] = [0]; // Overview is always unlocked
  if (assessmentBatch.submissions.length > 0) completedStages.push(1);
  if (classifications.length > 0) completedStages.push(2);
  if (groups.length > 0) completedStages.push(3);
  if (materials.length > 0 && pendingApprovalCount === 0) completedStages.push(4);
  if (deltaSummary !== null) completedStages.push(5);

  const canAdvance = currentStageIndex < WORKFLOW_STAGES.length - 1;

  // Actions
  const loadDemoClassroom = async () => {
    setAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    triggerMascotThinking("Analyzing Grade 8 Fictional Classroom...");
    const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    setClassifications(diag.classifications);

    const groupRes = groupStudentsByMisconceptions(diag.classifications);
    setGroups(groupRes.groups);

    const mats = groupRes.groups.map(generateRemedialMaterialForGroup);
    setMaterials(mats);

    const delta = analyzeInterventionDeltas(DEMO_PRE_POST_RECORDS);
    setDeltaSummary(delta);

    triggerMascotSuccess("Demo class loaded! 4 misconception clusters detected.");
  };

  const updateAssessmentBatch = async (batch: AssessmentBatch) => {
    setAssessmentBatch(batch);
    triggerMascotThinking("Classifying custom student assessment...");
    const diag = await classifyAssessmentBatch(batch);
    setClassifications(diag.classifications);

    const groupRes = groupStudentsByMisconceptions(diag.classifications);
    setGroups(groupRes.groups);

    const mats = groupRes.groups.map(generateRemedialMaterialForGroup);
    setMaterials(mats);

    triggerMascotSuccess(`Ingested ${batch.submissions.length} students across ${batch.questions.length} questions!`);
  };

  const verifyClassification = (id: string, newTag?: string, notes?: string) => {
    setClassifications((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            misconceptionTag: newTag || item.misconceptionTag,
            isUncertain: false,
            verifiedByTeacher: true,
            teacherOverrideNotes: notes,
          };
        }
        return item;
      });

      // Update groups dynamically based on verified data
      const newGrouping = groupStudentsByMisconceptions(updated);
      setGroups(newGrouping.groups);
      return updated;
    });

    triggerMascotSuccess("Teacher sign-off recorded! Cohorts updated.");
  };

  const approveMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: "approved" } : m))
    );
    triggerMascotSuccess("Remedial lesson approved! Ready for student distribution.");
  };

  const rejectMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: "rejected" } : m))
    );
    triggerMascotError("Material rejected. Teacher revision requested.", "approval-gate");
  };

  const goToStage = (index: number) => {
    if (index >= 0 && index < WORKFLOW_STAGES.length) {
      router.push(WORKFLOW_STAGES[index].path);
    }
  };

  const continueToNextStage = () => {
    if (canAdvance) {
      goToStage(currentStageIndex + 1);
    }
  };

  const goToPreviousStage = () => {
    if (currentStageIndex > 0) {
      goToStage(currentStageIndex - 1);
    }
  };

  // Mascot trigger helpers
  const triggerMascotError = (message: string, targetId?: string) => {
    setMascotState("error");
    setMascotMessage(message);
    setMascotTargetId(targetId || null);
  };

  const triggerMascotSuccess = (message: string) => {
    setMascotState("success");
    setMascotMessage(message);
    setTimeout(() => {
      setMascotState("idle");
    }, 4500);
  };

  const triggerMascotThinking = (message: string) => {
    setMascotState("thinking");
    setMascotMessage(message);
  };

  const dismissMascot = () => {
    setMascotState("idle");
    setMascotMessage("");
    setMascotTargetId(null);
  };

  return (
    <WorkflowContext.Provider
      value={{
        currentStageIndex,
        stages: WORKFLOW_STAGES,
        completedStages,
        canAdvance,
        unresolvedReviewCount,
        pendingApprovalCount,
        assessmentBatch,
        classifications,
        groups,
        materials,
        deltaSummary,
        loadDemoClassroom,
        updateAssessmentBatch,
        verifyClassification,
        approveMaterial,
        rejectMaterial,
        continueToNextStage,
        goToPreviousStage,
        goToStage,
        mascotState,
        mascotMessage,
        mascotTargetId,
        setMascotState,
        triggerMascotError,
        triggerMascotSuccess,
        triggerMascotThinking,
        dismissMascot,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}

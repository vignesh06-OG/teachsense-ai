import { z } from "zod";

// Fictional Student Answer Submission
export const StudentAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  studentAnswer: z.string().min(1, "Answer text is required"),
  workShown: z.string().optional(),
});

export type StudentAnswer = z.infer<typeof StudentAnswerSchema>;

// Fictional Student Record (Strictly zero real PII)
export const StudentSubmissionSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(1, "Fictional student name is required"),
  answers: z.array(StudentAnswerSchema).min(1, "At least one answer must be submitted"),
});

export type StudentSubmission = z.infer<typeof StudentSubmissionSchema>;

// Assessment Question Metadata & Standard Answer
export const QuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  prompt: z.string().min(1, "Question prompt is required"),
  topic: z.string().min(1, "Topic category is required"),
  standard: z.string().optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Assessment Batch Schema
export const AssessmentBatchSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  assessmentTitle: z.string().min(1, "Assessment title is required"),
  subject: z.string().default("Mathematics"),
  gradeLevel: z.string().default("8th Grade"),
  questions: z.array(QuestionSchema).min(1, "At least one question is required"),
  submissions: z.array(StudentSubmissionSchema).min(1, "At least one student submission is required"),
});

export type AssessmentBatch = z.infer<typeof AssessmentBatchSchema>;

// Misconception Classification Result
export const MisconceptionClassificationSchema = z.object({
  id: z.string().min(1),
  studentId: z.string().min(1),
  studentName: z.string().min(1),
  questionId: z.string().min(1),
  studentAnswer: z.string(),
  correctAnswer: z.string(),
  isCorrect: z.boolean(),
  misconceptionTag: z.string(),
  misconceptionLabel: z.string(),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  isUncertain: z.boolean(), // true if confidence < 0.85
  verifiedByTeacher: z.boolean().default(false),
  teacherOverrideNotes: z.string().optional(),
});

export type MisconceptionClassification = z.infer<typeof MisconceptionClassificationSchema>;

// Student Grouping Schema
export const StudentGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  misconceptionTag: z.string(),
  misconceptionLabel: z.string(),
  severity: z.enum(["high", "medium", "low"]),
  studentIds: z.array(z.string()),
  studentNames: z.array(z.string()),
  recommendedStrategy: z.string(),
  keyVocabulary: z.array(z.string()),
  targetedObjective: z.string(),
});

export type StudentGroup = z.infer<typeof StudentGroupSchema>;

// Remedial Targeted Material Schema
export const RemedialMaterialSchema = z.object({
  id: z.string().min(1),
  groupId: z.string().min(1),
  groupName: z.string(),
  misconceptionTag: z.string(),
  title: z.string(),
  targetConcept: z.string(),
  conceptualReframing: z.string(),
  counterExamples: z.array(
    z.object({
      flawedThinking: z.string(),
      correctedApproach: z.string(),
      explanation: z.string(),
    })
  ),
  scaffoldedPractice: z.array(
    z.object({
      problem: z.string(),
      hint: z.string(),
      solution: z.string(),
    })
  ),
  exitTicketQuestion: z.object({
    prompt: z.string(),
    options: z.array(z.string()),
    correctIndex: z.number(),
    diagnosticDistractorNote: z.string(),
  }),
  approvalStatus: z.enum(["pending", "approved", "rejected"]).default("pending"),
  teacherNotes: z.string().optional(),
});

export type RemedialMaterial = z.infer<typeof RemedialMaterialSchema>;

// Pre vs Post Intervention Delta Schema
export const StudentDeltaSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  preScore: z.number().min(0).max(100),
  postScore: z.number().min(0).max(100),
  rawGain: z.number(),
  normalizedGain: z.number(), // Hake's normalized gain g = (post - pre) / (100 - pre)
  misconceptionTag: z.string(),
  status: z.enum(["remediated", "partial_progress", "needs_follow_up"]),
});

export type StudentDelta = z.infer<typeof StudentDeltaSchema>;

export const DeltaAnalysisSummarySchema = z.object({
  totalStudents: z.number(),
  preAverage: z.number(),
  postAverage: z.number(),
  averageNormalizedGain: z.number(),
  cohensD: z.number(), // effect size
  remediationRate: z.number(), // percentage of students who resolved misconception
  cohortDeltas: z.array(StudentDeltaSchema),
});

export type DeltaAnalysisSummary = z.infer<typeof DeltaAnalysisSummarySchema>;

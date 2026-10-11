import { NextRequest, NextResponse } from "next/server";
import { analyzeInterventionDeltas, StudentScoreRecord } from "@/lib/engines/delta-analyzer";

// Standard benchmark demo pre/post intervention test dataset
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const records: StudentScoreRecord[] = body?.records || DEMO_PRE_POST_RECORDS;

    const summary = analyzeInterventionDeltas(records);

    return NextResponse.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Delta Analysis Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const summary = analyzeInterventionDeltas(DEMO_PRE_POST_RECORDS);
  return NextResponse.json({
    success: true,
    data: summary,
  });
}

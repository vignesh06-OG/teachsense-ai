import { NextRequest, NextResponse } from "next/server";
import { AssessmentBatchSchema } from "@/lib/validators/assessment-schema";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    // If no body provided, use default fictional classroom demo dataset
    const assessmentData = body?.assessment || FICTIONAL_CLASSROOM_ASSESSMENT;

    const parseResult = AssessmentBatchSchema.safeParse(assessmentData);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment data schema",
          issues: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await classifyAssessmentBatch(parseResult.data);

    return NextResponse.json({
      success: true,
      data: result,
      engineMode: process.env.OPENAI_API_KEY
        ? "hybrid_cloud_llm"
        : "deterministic_local_heuristic",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Classification Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  // Convenience endpoint providing pre-computed fictional demo results
  const result = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
  return NextResponse.json({
    success: true,
    data: result,
    engineMode: "deterministic_local_heuristic",
  });
}

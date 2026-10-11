import { NextRequest, NextResponse } from "next/server";
import { groupStudentsByMisconceptions } from "@/lib/engines/student-grouper";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { MisconceptionClassificationSchema } from "@/lib/validators/assessment-schema";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    let classifications = body?.classifications;

    // Fallback to classifying fictional classroom if omitted
    if (!classifications || !Array.isArray(classifications) || classifications.length === 0) {
      const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
      classifications = diag.classifications;
    } else {
      const arraySchema = z.array(MisconceptionClassificationSchema);
      const parsed = arraySchema.safeParse(classifications);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: "Invalid classifications list", issues: parsed.error.flatten() },
          { status: 400 }
        );
      }
      classifications = parsed.data;
    }

    const groupingResult = groupStudentsByMisconceptions(classifications, body?.options);

    return NextResponse.json({
      success: true,
      data: groupingResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Grouping Engine Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
  const result = groupStudentsByMisconceptions(diag.classifications);
  return NextResponse.json({ success: true, data: result });
}

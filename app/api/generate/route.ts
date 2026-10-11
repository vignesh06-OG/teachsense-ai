import { NextRequest, NextResponse } from "next/server";
import { generateRemedialMaterialForGroup } from "@/lib/engines/material-generator";
import { groupStudentsByMisconceptions } from "@/lib/engines/student-grouper";
import { classifyAssessmentBatch } from "@/lib/engines/misconception-classifier";
import { FICTIONAL_CLASSROOM_ASSESSMENT } from "@/lib/demo-data/fictional-class";
import { StudentGroupSchema, RemedialMaterial } from "@/lib/validators/assessment-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    // If specific group provided
    if (body?.group) {
      const parsedGroup = StudentGroupSchema.safeParse(body.group);
      if (!parsedGroup.success) {
        return NextResponse.json(
          { success: false, error: "Invalid group data", issues: parsedGroup.error.flatten() },
          { status: 400 }
        );
      }
      const material = generateRemedialMaterialForGroup(parsedGroup.data);
      return NextResponse.json({ success: true, data: material });
    }

    // Default: generate for all cohorts from demo assessment
    const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
    const { groups } = groupStudentsByMisconceptions(diag.classifications);
    const materials: RemedialMaterial[] = groups.map(generateRemedialMaterialForGroup);

    return NextResponse.json({
      success: true,
      data: materials,
      totalGenerated: materials.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Material Generator Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const diag = await classifyAssessmentBatch(FICTIONAL_CLASSROOM_ASSESSMENT);
  const { groups } = groupStudentsByMisconceptions(diag.classifications);
  const materials = groups.map(generateRemedialMaterialForGroup);
  return NextResponse.json({ success: true, data: materials });
}

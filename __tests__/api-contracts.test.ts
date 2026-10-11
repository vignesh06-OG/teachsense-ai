import { describe, it, expect } from "vitest";
import { POST as classifyPost, GET as classifyGet } from "@/app/api/classify/route";
import { POST as groupPost, GET as groupGet } from "@/app/api/group/route";
import { POST as generatePost, GET as generateGet } from "@/app/api/generate/route";
import { POST as comparePost, GET as compareGet } from "@/app/api/compare/route";
import { NextRequest } from "next/server";

function createMockRequest(url: string, body?: any): NextRequest {
  const reqInit: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    reqInit.body = JSON.stringify(body);
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), reqInit as any);
}

describe("API Route Contracts", () => {
  it("GET /api/classify returns pre-computed demo classifications", async () => {
    const res = await classifyGet();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.totalEvaluated).toBe(40);
  });

  it("POST /api/classify with empty body defaults to fictional class", async () => {
    const req = createMockRequest("/api/classify", {});
    const res = await classifyPost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.classifications.length).toBeGreaterThan(0);
  });

  it("POST /api/classify with invalid body returns 400", async () => {
    const req = createMockRequest("/api/classify", { assessment: { invalid: true } });
    const res = await classifyPost(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("GET /api/group returns student cohorts", async () => {
    const res = await groupGet();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.groups.length).toBeGreaterThan(0);
  });

  it("POST /api/group with empty body returns groups", async () => {
    const req = createMockRequest("/api/group", {});
    const res = await groupPost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.groups.length).toBeGreaterThan(0);
  });

  it("GET /api/generate returns remedial materials", async () => {
    const res = await generateGet();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("POST /api/generate generates batch materials", async () => {
    const req = createMockRequest("/api/generate", {});
    const res = await generatePost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it("GET /api/compare returns efficacy summary", async () => {
    const res = await compareGet();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.totalStudents).toBe(10);
    expect(json.data.cohensD).toBeGreaterThan(0);
  });

  it("POST /api/compare processes custom records", async () => {
    const req = createMockRequest("/api/compare", {
      records: [
        { studentId: "S1", studentName: "Taylor", preScore: 50, postScore: 90, misconceptionTag: "SIGN" },
      ],
    });
    const res = await comparePost(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.totalStudents).toBe(1);
    expect(json.data.cohortDeltas[0].status).toBe("remediated");
  });
});

import { NextRequest, NextResponse } from "next/server";
import { generateRemediationPatch } from "@/lib/remediate/patch-generator";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { findingId, findingData } = body;

    let finding = findingData;

    if (!finding && findingId) {
      const dbFinding = await db.finding.findUnique({
        where: { id: findingId },
      });
      if (dbFinding) {
        finding = {
          ...dbFinding,
          evidence: JSON.parse(dbFinding.evidence),
          rootCause: JSON.parse(dbFinding.rootCause),
        };
      }
    }

    if (!finding) {
      return NextResponse.json(
        { error: "Finding information is required" },
        { status: 400 }
      );
    }

    const patch = generateRemediationPatch(finding);

    // If findingId exists in DB, record or update remediation
    if (findingId) {
      await db.remediation.upsert({
        where: { id: `rem_${findingId}` },
        update: {
          patchDiff: patch.diff,
          validationResult: JSON.stringify(patch.validationResult),
          status: "READY",
        },
        create: {
          id: `rem_${findingId}`,
          findingId,
          tier: patch.tier,
          action: patch.actionSummary,
          patchDiff: patch.diff,
          prUrl: "https://github.com/acme-industries/precision-store/pull/185",
          prNumber: 185,
          validationResult: JSON.stringify(patch.validationResult),
          status: "READY",
        },
      });
    }

    return NextResponse.json(patch);
  } catch (err: any) {
    console.error("[API generate-fix] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate fix" },
      { status: 500 }
    );
  }
}

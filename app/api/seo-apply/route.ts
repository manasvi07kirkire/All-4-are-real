import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AdvisorPageContent, Suggestion } from "@/lib/seo-advisor/types";
import { applyApprovedSuggestions } from "@/lib/seo-advisor/apply";
import { openPullRequest } from "@/lib/seo-advisor/open-pr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const scanId: string = body.scanId;
    const approvedSuggestionIds: string[] = Array.isArray(body.approvedSuggestionIds) ? body.approvedSuggestionIds : [];
    const rejectedSuggestionIds: string[] = Array.isArray(body.rejectedSuggestionIds) ? body.rejectedSuggestionIds : [];

    if (!scanId || approvedSuggestionIds.length === 0) {
      return NextResponse.json(
        { error: "scanId and at least one approved suggestion id are required" },
        { status: 400 }
      );
    }

    const scan = await db.seoScan.findUnique({
      where: { id: scanId },
      include: { suggestions: true },
    });
    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    await db.$transaction([
      db.seoSuggestion.updateMany({
        where: { id: { in: approvedSuggestionIds }, scanId },
        data: { status: "approved" },
      }),
      ...(rejectedSuggestionIds.length > 0
        ? [
            db.seoSuggestion.updateMany({
              where: { id: { in: rejectedSuggestionIds }, scanId },
              data: { status: "rejected" },
            }),
          ]
        : []),
    ]);

    const approved: Suggestion[] = scan.suggestions
      .filter((s) => approvedSuggestionIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        type: s.type as Suggestion["type"],
        location: s.location,
        before: s.before,
        after: s.after,
        rationale: s.rationale,
        confidence: s.confidence,
        status: "approved",
      }));

    const content: AdvisorPageContent = JSON.parse(scan.content);
    const targetKeywords: string[] = JSON.parse(scan.targetKeywords);

    const { diff, validation } = applyApprovedSuggestions(scan.pageUrl, content, targetKeywords, approved);

    if (!validation.passed) {
      return NextResponse.json(
        {
          error: "Patched content failed on-page validation — PR was not opened.",
          validation,
        },
        { status: 422 }
      );
    }

    const { prUrl, prNumber, body: prBody } = openPullRequest(scan.pageUrl, approved);

    await db.$transaction([
      db.seoSuggestion.updateMany({
        where: { id: { in: approvedSuggestionIds }, scanId },
        data: { status: "applied" },
      }),
      db.seoOptimizationPR.create({
        data: {
          scanId,
          prUrl,
          prNumber,
          appliedSuggestionIds: JSON.stringify(approvedSuggestionIds),
          validationResult: JSON.stringify(validation),
          status: "OPEN",
        },
      }),
    ]);

    return NextResponse.json({
      prUrl,
      prNumber,
      prBody,
      diff,
      validation,
      appliedSuggestionIds: approvedSuggestionIds,
    });
  } catch (err: any) {
    console.error("[API seo-apply] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate PR" }, { status: 500 });
  }
}

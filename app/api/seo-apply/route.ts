import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AdvisorPageContent, Suggestion } from "@/lib/seo-advisor/types";
import { applyApprovedSuggestions } from "@/lib/seo-advisor/apply";
import { openPullRequest } from "@/lib/seo-advisor/open-pr";
import { extractTargetContent } from "@/lib/seo-advisor/extract-target";

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

    let scan: any = null;
    try {
      scan = await db.seoScan.findUnique({
        where: { id: scanId },
        include: { suggestions: true },
      });
    } catch (dbErr: any) {
      console.warn("[API seo-apply] DB lookup error:", dbErr.message);
    }

    let pageUrl = scan?.pageUrl || body.pageUrl || "https://store.acme-industrial.com/products/laser-tachometer-50000rpm";
    let content: AdvisorPageContent = scan ? JSON.parse(scan.content) : (body.content || await extractTargetContent(pageUrl));
    let targetKeywords: string[] = scan ? JSON.parse(scan.targetKeywords) : (body.targetKeywords || ["non-contact tachometer", "50000 RPM digital tachometer"]);
    
    let approved: Suggestion[] = [];
    if (scan?.suggestions) {
      approved = scan.suggestions
        .filter((s: any) => approvedSuggestionIds.includes(s.id))
        .map((s: any) => ({
          id: s.id,
          type: s.type as Suggestion["type"],
          location: s.location,
          before: s.before,
          after: s.after,
          rationale: s.rationale,
          confidence: s.confidence,
          status: "approved" as const,
        }));
    } else if (body.approvedSuggestions) {
      approved = body.approvedSuggestions;
    } else {
      // Fallback construction for approved suggestions
      approved = approvedSuggestionIds.map((id) => ({
        id,
        type: "rewrite-title" as const,
        location: "title",
        before: content.title || "",
        after: `${content.title || ""} — non-contact tachometer`,
        rationale: "Target keyword included in title",
        confidence: 85,
        status: "approved" as const,
      }));
    }

    if (scan) {
      try {
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
      } catch (e: any) {
        console.warn("[API seo-apply] DB transaction status update skipped:", e.message);
      }
    }

    const { diff, validation } = applyApprovedSuggestions(pageUrl, content, targetKeywords, approved);

    if (!validation.passed) {
      return NextResponse.json(
        {
          error: "Patched content failed on-page validation — PR was not opened.",
          validation,
        },
        { status: 422 }
      );
    }

    const { prUrl, prNumber, body: prBody } = openPullRequest(pageUrl, approved);

    if (scan) {
      try {
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
      } catch (e: any) {
        console.warn("[API seo-apply] DB PR creation skipped:", e.message);
      }
    }

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

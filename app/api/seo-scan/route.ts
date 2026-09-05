import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extractTargetContent } from "@/lib/seo-advisor/extract-target";
import { generateSuggestions } from "@/lib/seo-advisor/suggest";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pageUrl: string = body.pageUrl;
    const targetKeywords: string[] = Array.isArray(body.targetKeywords) ? body.targetKeywords : [];

    if (!pageUrl || targetKeywords.length === 0) {
      return NextResponse.json(
        { error: "pageUrl and at least one target keyword are required" },
        { status: 400 }
      );
    }

    const content = await extractTargetContent(pageUrl);
    const suggestions = await generateSuggestions({ pageUrl, targetKeywords, content });

    const scan = await db.seoScan.create({
      data: {
        pageUrl,
        targetKeywords: JSON.stringify(targetKeywords),
        content: JSON.stringify(content),
        status: "COMPLETE",
        suggestions: {
          create: suggestions.map((s) => ({
            id: s.id,
            type: s.type,
            location: s.location,
            before: s.before,
            after: s.after,
            rationale: s.rationale,
            confidence: s.confidence,
            status: s.status,
          })),
        },
      },
      include: { suggestions: true },
    });

    return NextResponse.json({
      scanId: scan.id,
      pageUrl: scan.pageUrl,
      targetKeywords,
      content,
      suggestions: scan.suggestions,
    });
  } catch (err: any) {
    console.error("[API seo-scan] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to run SEO Advisor scan" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { runCitationProbabilityTest } from "@/lib/geo/citation-test";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, pageText, query, expectedFacts } = body;

    const samplePageText =
      pageText ||
      `The Digital Micrometer Caliper 0.01mm is manufactured with hardened stainless steel housing and features precision calibration accuracy of ±0.01mm across a measuring range of 0-150mm. Designed for harsh machine shop environments with an IP67 water and dust resistance rating. Powered by dual LCD readout with both metric and imperial conversion modes. MSRP is $149.00 with a 3-year factory calibration guarantee.`;

    const result = await runCitationProbabilityTest({
      url: url || "/products/digital-micrometer-caliper",
      pageText: samplePageText,
      query,
      expectedFacts,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[API citation-test] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute citation test" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEMO_SCENARIO_183, DEMO_SCENARIO_184, DEMO_SCENARIO_185 } from "@/lib/fixtures/demo-data";
import { runDetectionRules } from "@/lib/detect/engine";
import { diagnoseRootCause } from "@/lib/diagnose/signature-matcher";
import { narrateFinding } from "@/lib/llm/narrator";
import { computeScores } from "@/lib/geo/scorer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const deployNumber = body.deployNumber || 184;

    // Load matching scenario
    let scenario = DEMO_SCENARIO_184;
    if (deployNumber === 183) scenario = DEMO_SCENARIO_183;
    if (deployNumber === 185) scenario = DEMO_SCENARIO_185;

    // Get Project from DB or create default
    let project = await db.project.findFirst();
    if (!project) {
      project = await db.project.create({
        data: {
          repo: "acme-industries/precision-store",
          siteUrl: "https://store.acme-industrial.com",
          routeManifest: JSON.stringify(["/", "/products/digital-micrometer-caliper"]),
        },
      });
    }

    // Upsert Deployment
    const deployment = await db.deployment.upsert({
      where: { id: `deploy_${deployNumber}` },
      update: {
        status: scenario.status,
        commitMsg: scenario.commitMsg,
        author: scenario.author,
      },
      create: {
        id: `deploy_${deployNumber}`,
        projectId: project.id,
        sha: scenario.sha,
        deployNumber: scenario.deployNumber,
        ref: scenario.ref,
        commitMsg: scenario.commitMsg,
        author: scenario.author,
        status: scenario.status,
      },
    });

    // 1. Run deterministic detection
    const findings = runDetectionRules({
      deploymentSha: scenario.sha,
      deployNumber: scenario.deployNumber,
      currentSnapshot: scenario.snapshot,
      previousSnapshot: deployNumber > 183 ? DEMO_SCENARIO_183.snapshot : undefined,
    });

    // 2. Run AST diagnosis on each finding
    for (const f of findings) {
      const rootCause = diagnoseRootCause(f, []);
      if (rootCause) {
        f.rootCause = rootCause;
      }
    }

    // 3. Score calculation
    const scores = computeScores(
      scenario.snapshot,
      findings,
      deployNumber > 183 ? { searchHealth: 96, geoScore: 88 } : undefined
    );

    // Update DB score
    await db.score.upsert({
      where: { deploymentId: deployment.id },
      update: {
        searchHealth: scores.searchHealth,
        geoScore: scores.geoScore,
        deltaSearch: scores.deltaSearch,
        deltaGeo: scores.deltaGeo,
        breakdown: JSON.stringify(scores.breakdown),
      },
      create: {
        deploymentId: deployment.id,
        searchHealth: scores.searchHealth,
        geoScore: scores.geoScore,
        deltaSearch: scores.deltaSearch,
        deltaGeo: scores.deltaGeo,
        breakdown: JSON.stringify(scores.breakdown),
      },
    });

    return NextResponse.json({
      deployment: {
        id: deployment.id,
        deployNumber: scenario.deployNumber,
        sha: scenario.sha,
        status: scenario.status,
        commitMsg: scenario.commitMsg,
        author: scenario.author,
        createdAt: scenario.createdAt,
      },
      scores,
      findings: findings.length > 0 ? findings : scenario.findings,
      snapshot: scenario.snapshot,
    });
  } catch (err: any) {
    console.error("[API run-analysis] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute analysis run" },
      { status: 500 }
    );
  }
}

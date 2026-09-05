"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { FieldManualNav, FieldManualSidebar } from "@/components/layout/FieldManualNav";
import { IncidentResolutionHero } from "@/components/remediation/IncidentResolutionHero";
import { RemediationRadialGauges } from "@/components/remediation/RemediationRadialGauges";
import { CrawlVerificationTable } from "@/components/remediation/CrawlVerificationTable";
import { AiGroundingSimCard } from "@/components/remediation/AiGroundingSimCard";
import { TopologyHealingCanvas } from "@/components/remediation/TopologyHealingCanvas";
import { ClosedLoopTelemetryStepper } from "@/components/remediation/ClosedLoopTelemetryStepper";
import { ReindexationBanner } from "@/components/remediation/ReindexationBanner";
import { ArrowLeft, GitMerge, CheckCircle, ShieldCheck } from "lucide-react";

// ── Crawl Verification Rows ──
const CRAWL_ROWS = [
  { route: "/products/noise-cancelling-headphones", status: 200, canonicalOk: true, structuredData: true, indexing: "YES" as const },
  { route: "/products/wireless-earbuds", status: 200, canonicalOk: true, structuredData: true, indexing: "YES" as const },
  { route: "/products/gaming-headset-pro", status: 200, canonicalOk: true, structuredData: false, indexing: "YES" as const },
  { route: "/products/smart-speaker-mini", status: 200, canonicalOk: true, structuredData: true, indexing: "YES" as const },
  { route: "/products/studio-monitor-headphones", status: 200, canonicalOk: true, structuredData: true, indexing: "YES" as const },
];

// ── Topology Nodes ──
const TOPOLOGY_NODES = [
  { id: "root", label: "acme.com", type: "root" as const, x: 200, y: 40 },
  { id: "prod", label: "/products", type: "ok" as const, x: 120, y: 100 },
  { id: "blog", label: "/blog", type: "ok" as const, x: 280, y: 100 },
  { id: "p1", label: "headphones", type: "ok" as const, x: 60, y: 170 },
  { id: "p2", label: "earbuds", type: "ok" as const, x: 160, y: 170 },
  { id: "sitemap", label: "sitemap.xml", type: "sitemap" as const, x: 320, y: 170 },
  { id: "p3", label: "gaming-pro", type: "ok" as const, x: 100, y: 240 },
  { id: "p4", label: "smart-spk", type: "ok" as const, x: 220, y: 240 },
];

const TOPOLOGY_EDGES = [
  { from: "root", to: "prod", active: true },
  { from: "root", to: "blog", active: true },
  { from: "root", to: "sitemap", active: false },
  { from: "prod", to: "p1", active: true },
  { from: "prod", to: "p2", active: true },
  { from: "prod", to: "p3", active: true },
  { from: "prod", to: "p4", active: true },
];

export default function RemediationPage() {
  const [isMerged, setIsMerged] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMerge = async () => {
    setIsMerging(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsMerged(true);
    setIsMerging(false);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#4FA695", "#E7A13A", "#F4EDE1"] });
  };

  const BEFORE_SEARCH = 42;
  const AFTER_SEARCH = 91;
  const BEFORE_GEO = 40;
  const AFTER_GEO = 88;

  return (
    <div className="min-h-screen bg-bone-100 flex flex-col">
      <FieldManualNav />

      <div className="flex-1 flex w-full">
        <FieldManualSidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-7 max-w-[1300px]">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 font-sans text-sm text-bone-700 hover:text-ink-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-bone-400">/</span>
            <span className="font-sans text-sm font-semibold text-ink-900">Remediation &amp; PR Gate</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col gap-1.5 border-b-2 border-bone-300 pb-5">
            <span className="font-mono text-xs font-bold text-ember-600 uppercase tracking-widest bg-ember-600/10 px-2 py-0.5 rounded-sm border border-ember-600/20 w-fit">
              SCREEN_05
            </span>
            <h1 className="font-mono font-black text-3xl sm:text-4xl md:text-5xl text-ink-900 tracking-tight leading-none">
              REMEDIATION &amp; PR GATE
            </h1>
            <p className="font-sans text-sm text-bone-700">
              Closed-loop automated incident resolution — from detection to verified reindexation.
            </p>
          </div>

          {/* Incident Hero */}
          <IncidentResolutionHero
            incidentId="2024-11-15-001"
            severity="CRITICAL"
            title="Missing canonical tag generator in ProductMetadata — 127 routes regressed"
            elapsedSeconds={elapsed + 47}
            deployNumber={184}
            affectedRoutes={127}
            status={isMerged ? "VERIFIED" : "REMEDIATING"}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* Left Column — 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-7">

              {/* PR Merge Gate */}
              <div className="bg-darkSurface-panel border border-ink-700 rounded-md p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 pb-4">
                  <div className="flex items-center gap-3">
                    <GitMerge className="w-5 h-5 text-patina-400" />
                    <span className="font-mono text-sm font-black text-bone-100 uppercase tracking-wider">
                      AUTO-FIX PR #185
                    </span>
                    <span className="font-mono text-xs font-bold text-marigold-400 bg-marigold-tint px-2.5 py-0.5 rounded-sm border border-marigold-400/30">
                      {isMerged ? "MERGED" : "READY"}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-bone-500">Tier-A · Zero Manual Intervention</span>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-sans font-bold text-lg text-bone-100">
                    Restore canonical tag generator in ProductMetadata
                  </h3>
                  <p className="font-sans text-sm text-bone-400 leading-relaxed">
                    Automated Tier-A remediation restoring missing canonical declarations across 127 product routes. Adds <code className="text-ember-400 font-mono text-sm bg-ink-700 px-1 py-0.5 rounded">alternates.canonical</code> to the generateMetadata export.
                  </p>
                </div>

                {/* Diff Block */}
                <div className="bg-darkSurface-code rounded-sm border border-ink-700 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-ink-700 flex items-center justify-between">
                    <span className="font-mono text-xs text-bone-500">src/app/products/[slug]/page.tsx</span>
                    <span className="font-mono text-xs text-bone-700">@@ -182,3 +182,7 @@</span>
                  </div>
                  <pre className="text-sm font-mono p-4 overflow-x-auto leading-relaxed">
                    <span className="text-bone-500">{"   return {\n"}</span>
                    <span className="text-bone-500">{"     title: product.name,\n"}</span>
                    <span className="text-bone-500">{"     description: product.summary,\n"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"+"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"    alternates: {\n"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"+"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"      canonical: `https://store.acme.com/products/${params.slug}`,\n"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"+"}</span>
                    <span className="text-patina-400 bg-patina-tint/40">{"    },\n"}</span>
                    <span className="text-bone-500">{"   };\n"}</span>
                  </pre>
                </div>

                {/* Validation Gates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "AST Validated",
                    "Rules: 0 Violations",
                    "Build: PASSED",
                  ].map((gate, i) => (
                    <div key={i} className="bg-ink-850 border border-ink-700 rounded-sm p-3 flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-patina-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-bone-300 uppercase tracking-wide">{gate}</span>
                    </div>
                  ))}
                </div>

                {/* Merge Button */}
                {!isMerged ? (
                  <button
                    onClick={handleMerge}
                    disabled={isMerging}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-patina-500 hover:bg-patina-400 text-bone-100 rounded-sm font-mono text-base font-black uppercase tracking-widest transition-all shadow-cta disabled:opacity-60"
                  >
                    <GitMerge className="w-5 h-5" />
                    <span>{isMerging ? "MERGING PR #185..." : "MERGE AUTO-FIX PR (#185)"}</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-patina-tint border border-patina-400/40 rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-patina-400" />
                    <span className="font-mono text-base font-black text-patina-400 uppercase tracking-widest">
                      PR #185 MERGED · INCIDENT CLOSED
                    </span>
                  </div>
                )}
              </div>

              {/* Health Recovery Gauges */}
              {isMerged && (
                <RemediationRadialGauges
                  beforeSearch={BEFORE_SEARCH}
                  afterSearch={AFTER_SEARCH}
                  beforeGeo={BEFORE_GEO}
                  afterGeo={AFTER_GEO}
                />
              )}

              {/* Crawl Verification Table */}
              <CrawlVerificationTable rows={CRAWL_ROWS} />

              {/* AI Grounding Simulation */}
              <AiGroundingSimCard
                prompt="What are the best noise-cancelling headphones available at Acme Store?"
                aiResponse={
                  isMerged
                    ? "Acme Store's best noise-cancelling headphones include the ProAudio NC-1000 featuring 40hr battery life and adaptive ANC. Available at $299 with free shipping."
                    : "Acme Store offers various audio products. You may find noise-cancelling headphones there, though specific models aren't confirmed in my training data."
                }
                segments={
                  isMerged
                    ? [
                      { grounded: true, source: "ProductMetadata.tsx" },
                      { grounded: true, source: "ProductMetadata.tsx" },
                      { grounded: true, source: "PricingSchema.tsx" },
                      { grounded: true, source: "ShippingSchema.tsx" },
                      { grounded: false },
                    ]
                    : [
                      { grounded: false },
                      { grounded: false },
                      { grounded: true, source: "CategoryPage.tsx" },
                      { grounded: false },
                      { grounded: false },
                    ]
                }
                groundingScore={isMerged ? 80 : 20}
                hallucination={
                  !isMerged
                    ? "AI engine cannot ground entity attributes (price, model, features) due to missing canonical & JSON-LD schemas. Response is a hallucination."
                    : undefined
                }
              />
            </div>

            {/* Right Column — 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-7">

              {/* Telemetry Stepper */}
              <ClosedLoopTelemetryStepper
                steps={[
                  {
                    step: 1, label: "DETECTED", timing: "0.8ms", status: "done",
                    description: "AST parser flagged missing canonical emitter. 127 routes affected.",
                  },
                  {
                    step: 2, label: "ATTRIBUTED", timing: "1.2ms", status: "done",
                    description: "Git blame isolated commit abc1234 in deploy #184.",
                  },
                  {
                    step: 3, label: "PATCH GENERATED", timing: "340ms", status: "done",
                    description: "Tier-A auto-fix PR #185 created. Restores alternates.canonical.",
                  },
                  {
                    step: 4, label: "MERGE APPLIED", timing: "12s",
                    status: isMerged ? "done" : "active",
                    description: isMerged ? "PR #185 merged. Build: PASSED." : "Awaiting merge approval...",
                  },
                  {
                    step: 5, label: "REINDEXATION", timing: "~4min",
                    status: isMerged ? "active" : "pending",
                    description: "Googlebot + AI engine re-verification across all 127 routes.",
                  },
                ]}
              />

              {/* Topology Canvas */}
              <TopologyHealingCanvas
                nodes={TOPOLOGY_NODES}
                edges={TOPOLOGY_EDGES}
                stats={{ depth: 3, okRate: 100, orphans: 0 }}
              />

              {/* Reindexation Banner */}
              <ReindexationBanner
                status={isMerged ? "IN_PROGRESS" : "SCHEDULED"}
                routesReindexed={isMerged ? 89 : 0}
                totalRoutes={127}
                estimatedMinutes={isMerged ? 3 : undefined}
                deployNumber={185}
              />

            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-bone-100 border-t-2 border-bone-300 py-4 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-ember-600 text-bone-100 font-mono font-black text-xs flex items-center justify-center rounded-sm">
              SO
            </div>
            <span className="font-mono text-sm font-bold text-ink-900">SEARCHOPS_v1.0</span>
            <span className="text-bone-400">·</span>
            <span className="font-sans text-sm text-bone-700">Remediation &amp; PR Gate</span>
          </div>
          <span className="font-sans text-sm text-bone-500">
            Closed-loop · Zero manual intervention
          </span>
        </div>
      </footer>
    </div>
  );
}

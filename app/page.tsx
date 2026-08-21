"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { FieldManualNav, FieldManualSidebar } from "@/components/layout/FieldManualNav";
import { DeploymentStrip, DeploymentSummary } from "@/components/ui/DeploymentStrip";
import { Gauge } from "@/components/ui/Gauge";
import { FindingCard } from "@/components/ui/FindingCard";
import { CitationMeter } from "@/components/ui/CitationMeter";
import { PRCard } from "@/components/ui/PRCard";
import { DEMO_SCENARIO_183, DEMO_SCENARIO_184, DEMO_SCENARIO_185 } from "@/lib/fixtures/demo-data";
import { FindingData } from "@/lib/detect/types";
import { GeneratedPatch } from "@/lib/remediate/patch-generator";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  Cpu,
  Zap,
  CheckCircle,
  FileCode,
} from "lucide-react";

export default function DashboardPage() {
  const [activeDeployNumber, setActiveDeployNumber] = useState<number>(184);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [generatedPatch, setGeneratedPatch] = useState<GeneratedPatch | null>(null);

  // Dynamic scenario data
  const currentScenario =
    activeDeployNumber === 183
      ? DEMO_SCENARIO_183
      : activeDeployNumber === 185
      ? DEMO_SCENARIO_185
      : DEMO_SCENARIO_184;

  const deploymentsList: DeploymentSummary[] = [
    {
      id: "deploy_183",
      deployNumber: 183,
      sha: DEMO_SCENARIO_183.sha,
      ref: DEMO_SCENARIO_183.ref,
      commitMsg: DEMO_SCENARIO_183.commitMsg,
      author: DEMO_SCENARIO_183.author,
      status: DEMO_SCENARIO_183.status,
      searchHealth: DEMO_SCENARIO_183.scores.searchHealth,
      geoScore: DEMO_SCENARIO_183.scores.geoScore,
      deltaSearch: DEMO_SCENARIO_183.scores.deltaSearch,
      createdAt: DEMO_SCENARIO_183.createdAt,
    },
    {
      id: "deploy_184",
      deployNumber: 184,
      sha: DEMO_SCENARIO_184.sha,
      ref: DEMO_SCENARIO_184.ref,
      commitMsg: DEMO_SCENARIO_184.commitMsg,
      author: DEMO_SCENARIO_184.author,
      status: DEMO_SCENARIO_184.status,
      searchHealth: DEMO_SCENARIO_184.scores.searchHealth,
      geoScore: DEMO_SCENARIO_184.scores.geoScore,
      deltaSearch: DEMO_SCENARIO_184.scores.deltaSearch,
      createdAt: DEMO_SCENARIO_184.createdAt,
    },
    {
      id: "deploy_185",
      deployNumber: 185,
      sha: DEMO_SCENARIO_185.sha,
      ref: DEMO_SCENARIO_185.ref,
      commitMsg: DEMO_SCENARIO_185.commitMsg,
      author: DEMO_SCENARIO_185.author,
      status: DEMO_SCENARIO_185.status,
      searchHealth: DEMO_SCENARIO_185.scores.searchHealth,
      geoScore: DEMO_SCENARIO_185.scores.geoScore,
      deltaSearch: DEMO_SCENARIO_185.scores.deltaSearch,
      createdAt: DEMO_SCENARIO_185.createdAt,
    },
  ];

  // Handle generating patch
  const handleGenerateFix = async (finding: FindingData) => {
    setIsFixing(true);
    try {
      const res = await fetch("/api/generate-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingData: finding }),
      });
      const data = await res.json();
      setGeneratedPatch(data);
    } catch (err) {
      console.error("Fix generation error:", err);
    } finally {
      setIsFixing(false);
    }
  };

  // Handle merging fix
  const handleMergeFix = () => {
    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setActiveDeployNumber(185);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C23F10", "#4FA695", "#E7A13A", "#F4EDE1"],
      });
    }, 1000);
  };

  // Simulate poisoned deploy
  const handleSimulatePoisonedDeploy = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setActiveDeployNumber(184);
      setGeneratedPatch(null);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-bone-100 text-ink-900 flex flex-col font-sans">
      {/* Field Manual Top Navigation */}
      <FieldManualNav
        currentDeployNumber={activeDeployNumber}
        onSelectDeploy={(num) => {
          setActiveDeployNumber(num);
          if (num === 185) setGeneratedPatch(null);
        }}
        onTriggerPoisonedDeploy={handleSimulatePoisonedDeploy}
        isTriggering={isSimulating}
      />

      {/* Main Layout with Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <FieldManualSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-[1300px]">
          {/* Page Title & Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bone-300 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ember-600 uppercase tracking-widest">
                  // SCREEN_01
                </span>
                <span className="font-mono text-xs text-bone-700">·</span>
                <span className="font-mono text-xs font-semibold text-bone-700">
                  DEPLOY #{activeDeployNumber} ({currentScenario.status})
                </span>
              </div>
              <h1 className="font-mono font-bold text-2xl sm:text-3xl text-ink-900 tracking-tight mt-1">
                SEARCHOPS FIELD MANUAL
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/regression/184"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bone-300/40 hover:bg-bone-300 border border-bone-300 rounded-sm font-mono text-xs font-bold text-ink-900 uppercase transition-all"
              >
                <span>Regression View</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ember-600" />
              </Link>
              <Link
                href="/geo"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bone-300/40 hover:bg-bone-300 border border-bone-300 rounded-sm font-mono text-xs font-bold text-ink-900 uppercase transition-all"
              >
                <span>GEO Lens</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-steel-400" />
              </Link>
            </div>
          </div>

          {/* Deployment Diff Strip */}
          <DeploymentStrip
            deployments={deploymentsList}
            activeDeployNumber={activeDeployNumber}
            onSelectDeployment={(num) => setActiveDeployNumber(num)}
          />

          {/* Dual Gauges Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <Gauge
              value={currentScenario.scores.searchHealth}
              title="Search Crawler Health"
              lensLabel="SEARCH LENS"
              delta={currentScenario.scores.deltaSearch}
            />
            <Gauge
              value={currentScenario.scores.geoScore}
              title="AI-Answer Citation-Readiness (GEO)"
              lensLabel="AI-ANSWER LENS"
              delta={currentScenario.scores.deltaGeo}
            />
          </section>

          {/* Bento Split: Findings (2/3) + System Load / Telemetry (1/3) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Findings Panel (8 cols on lg) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bone-300 pb-2">
                <span className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wider">
                  DETERMINISTIC REGRESSION FINDINGS ({currentScenario.findings.length})
                </span>
                <span className="font-mono text-[10.5px] text-bone-700 font-semibold">
                  Rule Engine Attribution · Pure Code
                </span>
              </div>

              {currentScenario.findings.length === 0 ? (
                <div className="bg-bone-100 border border-bone-300 rounded-sm p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-patina-400" />
                  <div className="flex flex-col">
                    <h4 className="font-mono font-bold text-base text-ink-900">
                      No Discoverability Regressions Detected
                    </h4>
                    <p className="font-sans text-xs text-bone-700 mt-1 max-w-md">
                      All canonical tags, JSON-LD structured schemas, and indexing directives are verified healthy under deployment #{activeDeployNumber}.
                    </p>
                  </div>
                </div>
              ) : (
                currentScenario.findings.map((f) => (
                  <FindingCard
                    key={f.id}
                    finding={f}
                    onGenerateFix={handleGenerateFix}
                    isFixing={isFixing}
                  />
                ))
              )}

              {/* Generated PR Remediation Card */}
              {(generatedPatch || activeDeployNumber === 185) && (
                <PRCard
                  prNumber={185}
                  title="Restore canonical tag generator in ProductMetadata"
                  body="Automated Tier-A remediation restoring missing canonical declarations across 127 product routes."
                  diff={
                    generatedPatch?.diff ||
                    `--- a/src/app/products/[slug]/page.tsx
+++ b/src/app/products/[slug]/page.tsx
@@ -182,3 +182,7 @@ export async function generateMetadata({ params }: Props): Promise<Metadata> {
   return {
     title: product.name,
     description: product.summary,
+    alternates: {
      canonical: \`https://store.acme.com/products/\${params.slug}\`,
    },
   };
 }`
                  }
                  targetFile="src/app/products/[slug]/page.tsx"
                  status={activeDeployNumber === 185 ? "APPLIED" : "READY"}
                  onMergeFix={handleMergeFix}
                  isMerging={isMerging}
                />
              )}
            </div>

            {/* System Load & Telemetry Sidebar (4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-bone-300 pb-2">
                <span className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wider">
                  SYSTEM TELEMETRY
                </span>
                <span className="font-mono text-[10px] text-patina-600 bg-patina-400/20 px-1.5 py-0.5 rounded-sm font-bold">
                  LIVE
                </span>
              </div>

              {/* Telemetry Card 1: Crawl Budget */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between text-xs text-bone-700 font-bold uppercase">
                  <span>CRAWL BUDGET EFFICIENCY</span>
                  <span className="text-ink-900 tabular-nums">94.2%</span>
                </div>
                <div className="w-full bg-bone-300 h-2 rounded-sm overflow-hidden">
                  <div className="bg-patina-400 h-full w-[94.2%]" />
                </div>
                <span className="text-[11px] text-bone-700">
                  Googlebot & Bingbot index latency: <strong>42ms</strong> avg
                </span>
              </div>

              {/* Telemetry Card 2: Neural Grounding Index */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between text-xs text-bone-700 font-bold uppercase">
                  <span>NEURAL GROUNDING FIDELITY</span>
                  <span className={activeDeployNumber === 184 ? "text-ember-600 font-bold tabular-nums" : "text-patina-600 font-bold tabular-nums"}>
                    {activeDeployNumber === 184 ? "40% (POISONED)" : "100% (STABLE)"}
                  </span>
                </div>
                <div className="w-full bg-bone-300 h-2 rounded-sm overflow-hidden">
                  <div
                    className={activeDeployNumber === 184 ? "bg-ember-600 h-full w-[40%]" : "bg-patina-400 h-full w-[100%]"}
                  />
                </div>
                <span className="text-[11px] text-bone-700">
                  Target entities extracted by LLM engines
                </span>
              </div>

              {/* Telemetry Card 3: Quick Navigation to Field Manual Views */}
              <div className="bg-bone-300/30 border border-bone-300 rounded-sm p-4 flex flex-col gap-3 font-mono">
                <span className="text-xs font-bold text-ink-900 uppercase">
                  FIELD MANUAL MODULES
                </span>
                <div className="flex flex-col gap-2 text-xs">
                  <Link
                    href="/regression/184"
                    className="flex items-center justify-between p-2 rounded-sm bg-bone-100 border border-bone-300 hover:border-ember-600 transition-all text-ink-900 group font-bold"
                  >
                    <span>Page 2: Regression Bento</span>
                    <ArrowUpRight className="w-4 h-4 text-ember-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/geo"
                    className="flex items-center justify-between p-2 rounded-sm bg-bone-100 border border-bone-300 hover:border-steel-400 transition-all text-ink-900 group font-bold"
                  >
                    <span>Page 3: GEO Citation Test</span>
                    <ArrowUpRight className="w-4 h-4 text-steel-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/graph"
                    className="flex items-center justify-between p-2 rounded-sm bg-bone-100 border border-bone-300 hover:border-patina-400 transition-all text-ink-900 group font-bold"
                  >
                    <span>Page 4: Discovery Map</span>
                    <ArrowUpRight className="w-4 h-4 text-patina-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/seo-advisor"
                    className="flex items-center justify-between p-2 rounded-sm bg-bone-100 border border-bone-300 hover:border-steel-400 transition-all text-ink-900 group font-bold"
                  >
                    <span>Page 5: SEO Advisor</span>
                    <ArrowUpRight className="w-4 h-4 text-steel-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Field Manual Footer */}
      <footer className="w-full bg-bone-100 border-t border-bone-300 py-3.5 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-bone-700">
          <div className="flex items-center gap-2">
            <span className="text-ink-900 font-bold">SEARCHOPS_v1.0</span>
            <span>·</span>
            <span>THE FIELD MANUAL DESIGN SYSTEM</span>
          </div>
          <div>
            Dual-Audience Precision CI/CD Instrument
          </div>
        </div>
      </footer>
    </div>
  );
}

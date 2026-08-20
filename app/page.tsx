"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "@/components/layout/Header";
import { DeploymentStrip, DeploymentSummary } from "@/components/ui/DeploymentStrip";
import { Gauge } from "@/components/ui/Gauge";
import { FindingCard } from "@/components/ui/FindingCard";
import { CitationMeter } from "@/components/ui/CitationMeter";
import { GraphCanvas } from "@/components/ui/GraphCanvas";
import { PRCard } from "@/components/ui/PRCard";
import { DEMO_SCENARIO_183, DEMO_SCENARIO_184, DEMO_SCENARIO_185 } from "@/lib/fixtures/demo-data";
import { FindingData } from "@/lib/detect/types";
import { GraphNodeData } from "@/lib/graph/types";
import { GeneratedPatch } from "@/lib/remediate/patch-generator";
import { Sparkles, Terminal, ArrowRight, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [activeDeployNumber, setActiveDeployNumber] = useState<number>(184);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isCitationTesting, setIsCitationTesting] = useState(false);
  
  const [generatedPatch, setGeneratedPatch] = useState<GeneratedPatch | null>(null);
  const [citationResult, setCitationResult] = useState<{
    score: number;
    modelAnswer: string;
    modelUsed: string;
    groundedFacts: { fact: string; isGrounded: boolean }[];
  }>({
    score: 2,
    modelAnswer:
      "The product appears to be a digital caliper. However, pricing data, structured schema entities, and complete technical specifications are not grounded in the source document.",
    modelUsed: "meta-llama/llama-3.3-70b-instruct:free",
    groundedFacts: [
      { fact: "Hardened stainless steel housing", isGrounded: true },
      { fact: "±0.01mm calibration accuracy", isGrounded: false },
      { fact: "$149.00 MSRP", isGrounded: false },
      { fact: "IP67 water resistance rating", isGrounded: false },
      { fact: "Dual LCD digital display", isGrounded: true },
    ],
  });

  // Current active scenario data
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

  // Adjust default citation score based on scenario
  useEffect(() => {
    if (activeDeployNumber === 183 || activeDeployNumber === 185) {
      setCitationResult({
        score: 5,
        modelAnswer:
          "The Digital Micrometer Caliper features a hardened stainless steel housing with a precision calibration accuracy of ±0.01mm, priced at $149.00 MSRP with IP67 water resistance rating.",
        modelUsed: "meta-llama/llama-3.3-70b-instruct:free",
        groundedFacts: [
          { fact: "Hardened stainless steel housing", isGrounded: true },
          { fact: "±0.01mm calibration accuracy", isGrounded: true },
          { fact: "$149.00 MSRP", isGrounded: true },
          { fact: "IP67 water resistance rating", isGrounded: true },
          { fact: "Dual LCD digital display", isGrounded: true },
        ],
      });
    } else {
      setCitationResult({
        score: 2,
        modelAnswer:
          "The product is a digital caliper. However, pricing data, structured schema entities, and complete technical specifications are not grounded in the source document.",
        modelUsed: "meta-llama/llama-3.3-70b-instruct:free",
        groundedFacts: [
          { fact: "Hardened stainless steel housing", isGrounded: true },
          { fact: "±0.01mm calibration accuracy", isGrounded: false },
          { fact: "$149.00 MSRP", isGrounded: false },
          { fact: "IP67 water resistance rating", isGrounded: false },
          { fact: "Dual LCD digital display", isGrounded: true },
        ],
      });
    }
  }, [activeDeployNumber]);

  // Handle Generating Fix
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

  // Handle Merging Fix
  const handleMergeFix = () => {
    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setActiveDeployNumber(185);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3E8C7E", "#4FA695", "#E8531C", "#F4EDE1"],
      });
    }, 1200);
  };

  // Handle Live Citation Test with OpenRouter
  const handleRunLiveCitationTest = async () => {
    setIsCitationTesting(true);
    try {
      const res = await fetch("/api/citation-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "/products/digital-micrometer-caliper",
          query: "What is the calibration accuracy, housing material, MSRP, and IP rating of this caliper?",
          expectedFacts: [
            "Hardened stainless steel housing",
            "±0.01mm calibration accuracy",
            "$149.00 MSRP",
            "IP67 water resistance rating",
            "Dual LCD digital display",
          ],
        }),
      });
      const data = await res.json();
      setCitationResult({
        score: data.score || 5,
        modelAnswer: data.modelAnswer,
        modelUsed: data.modelUsed,
        groundedFacts: data.groundedFacts || [],
      });
    } catch (err) {
      console.error("Citation test error:", err);
    } finally {
      setIsCitationTesting(false);
    }
  };

  // Simulate poisoned commit
  const handleSimulatePoisonedDeploy = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setActiveDeployNumber(184);
      setGeneratedPatch(null);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Weathered-Metal Header */}
      <Header
        currentDeployNumber={activeDeployNumber}
        onSelectDeploy={(num) => {
          setActiveDeployNumber(num);
          if (num === 185) {
            setGeneratedPatch(null);
          }
        }}
        onTriggerPoisonedDeploy={handleSimulatePoisonedDeploy}
        isTriggering={isSimulating}
      />

      {/* Main App Body - Strict 1200px max-width container with responsive padding */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col gap-6">
        {/* 1. Deployment Diff Strip */}
        <DeploymentStrip
          deployments={deploymentsList}
          activeDeployNumber={activeDeployNumber}
          onSelectDeployment={(num) => setActiveDeployNumber(num)}
        />

        {/* 2. Hero Dual Gauges (Search Lens & AI-Answer Lens) - Stacks on mobile, splits on md/lg */}
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

        {/* 3. Operational Grid (Findings 7 Cols + GEO Citation Meter & PR Remediation 5 Cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Finding Cards & Deterministic Attributions (7 Cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-600 pb-2">
              <span className="font-mono text-xs font-bold text-bone-100 uppercase tracking-wider">
                Deterministic Regression Findings ({currentScenario.findings.length})
              </span>
              <span className="font-mono text-[10.5px] text-bone-500">
                Rule Engine Verdicts · Pure Code
              </span>
            </div>

            {currentScenario.findings.length === 0 ? (
              <div className="bg-ink-800 border border-line-600 rounded-md p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-8 h-8 text-patina-400" />
                <div className="flex flex-col">
                  <h4 className="font-ui text-base font-semibold text-bone-100">
                    No Discoverability Regressions Detected
                  </h4>
                  <p className="font-mono text-xs text-bone-500 mt-1 max-w-md">
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
          </div>

          {/* Right Column: GEO Citation-Probability Meter & PR Card (5 Cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* The Wedge: Live Citation Meter */}
            <CitationMeter
              score={citationResult.score}
              url="/products/digital-micrometer-caliper"
              query="What is the calibration accuracy and MSRP of this caliper?"
              modelAnswer={citationResult.modelAnswer}
              modelUsed={citationResult.modelUsed}
              groundedFacts={citationResult.groundedFacts}
              onReRunTest={handleRunLiveCitationTest}
              isLoading={isCitationTesting}
            />

            {/* Tier-A Remediation Card */}
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
+      canonical: \`https://store.acme.com/products/\${params.slug}\`,
+    },
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
        </section>

        {/* 4. Discoverability Graph Canvas (Full-bleed bottom section) */}
        <section className="w-full">
          <GraphCanvas
            nodes={currentScenario.snapshot.nodes}
            edges={currentScenario.snapshot.edges}
          />
        </section>
      </main>

      {/* Weathered-metal footer */}
      <footer className="w-full bg-ink-850 border-t border-line-600 py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-bone-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>SearchOps CI/CD</span>
            <span className="text-line-500">·</span>
            <span>Deterministic Attribution Engine v1.0</span>
          </div>

          <div>
            Powered by <span className="text-bone-300">OpenRouter Multi-Model Failover Chain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { FieldManualNav, FieldManualSidebar } from "@/components/layout/FieldManualNav";
import {
  Compass,
  ArrowLeft,
  Bot,
  User,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Sparkles,
  Layers,
  Database,
  Search,
} from "lucide-react";
import clsx from "clsx";

export default function GeoCitationPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [citationScore, setCitationScore] = useState(2); // 1-5
  const [modelAnswer, setModelAnswer] = useState(
    "The Digital Micrometer Caliper appears to be a precision measuring instrument. However, specific pricing, exact tolerance calibration (±0.01mm), and IP67 ingress protection specifications could not be verified in the structured ground-truth metadata."
  );

  const totalSegments = 5;

  const groundedFacts = [
    { fact: "Hardened stainless steel housing", grounded: true },
    { fact: "±0.01mm calibration accuracy", grounded: false },
    { fact: "$149.00 MSRP price entity", grounded: false },
    { fact: "IP67 water resistance rating", grounded: false },
    { fact: "Dual LCD digital display", grounded: true },
  ];

  const handleReRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/citation-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "/products/digital-micrometer-caliper",
          query: "What are the exact calibration tolerances and MSRP of the caliper?",
          expectedFacts: groundedFacts.map((f) => f.fact),
        }),
      });
      const data = await res.json();
      if (data.score) {
        setCitationScore(data.score);
      }
      if (data.modelAnswer) {
        setModelAnswer(data.modelAnswer);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone-100 text-ink-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <FieldManualNav currentDeployNumber={184} />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <FieldManualSidebar />

        {/* Main Content Area: 5-Col / 7-Col Split */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-[1300px]">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bone-300 pb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono text-xs text-bone-700">
                <Link href="/" className="hover:text-ink-900 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>DASHBOARD</span>
                </Link>
                <span>/</span>
                <span className="text-steel-400 font-bold uppercase tracking-wider">// SCREEN_03</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <h1 className="font-mono font-bold text-2xl sm:text-3xl text-ink-900 tracking-tight">
                  GEO CITATION TEST: AI ANSWER ENGINE LENS
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-bone-700">TARGET:</span>
              <code className="bg-bone-300/40 px-2 py-1 rounded-sm border border-bone-300 text-ink-900 font-bold">
                /products/digital-micrometer-caliper
              </code>
            </div>
          </div>

          {/* ── 5 COLS / 7 COLS SPLIT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── LEFT PANEL (5 COLS): GEO SCORE & NEURAL SPECS ── */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* GEO Score Bento Card */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-5 flex flex-col justify-between gap-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-bone-300 pb-2">
                  <span className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wider">
                    GEO CITATION-READINESS SCORE
                  </span>
                  <span className="font-mono text-[11px] font-bold text-ember-600 bg-ember-600/10 px-2 py-0.5 rounded-sm border border-ember-600/30">
                    -27 DEGRADED
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-2">
                  <span className="font-mono font-bold text-5xl sm:text-6xl text-ink-900 tabular-nums">
                    61
                  </span>
                  <span className="font-mono text-sm text-bone-700 font-bold">/ 100</span>
                  <div className="ml-auto text-right font-mono text-xs">
                    <span className="text-bone-700 block text-[10.5px]">PREVIOUS DEPLOY:</span>
                    <span className="line-through text-bone-700 font-bold">88</span>
                    <span className="text-ember-600 font-bold ml-1">→ 61 (-27)</span>
                  </div>
                </div>

                <p className="font-sans text-xs text-bone-700 leading-relaxed">
                  Generative Engine Optimization (GEO) index measuring how accurately LLMs cite and ground structured product specifications.
                </p>
              </div>

              {/* Neural Engine Specs Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center gap-1.5 text-xs text-bone-700 uppercase font-bold">
                    <Cpu className="w-3.5 h-3.5 text-steel-400" />
                    <span>TEST MODEL</span>
                  </div>
                  <span className="text-xs font-bold text-ink-900 truncate">
                    Llama 3.3 70B Instruct
                  </span>
                  <span className="text-[10.5px] text-bone-700">OpenRouter Omni-v2.1</span>
                </div>

                <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center gap-1.5 text-xs text-bone-700 uppercase font-bold">
                    <Layers className="w-3.5 h-3.5 text-steel-400" />
                    <span>EMBEDDING DEPTH</span>
                  </div>
                  <span className="text-xs font-bold text-ink-900">
                    4,096 Dimensions
                  </span>
                  <span className="text-[10.5px] text-bone-700">Cosine Sim: 0.742</span>
                </div>

                <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center gap-1.5 text-xs text-bone-700 uppercase font-bold">
                    <Database className="w-3.5 h-3.5 text-steel-400" />
                    <span>STRUCTURED ENTITIES</span>
                  </div>
                  <span className="text-xs font-bold text-ember-600">
                    2 of 5 Grounded
                  </span>
                  <span className="text-[10.5px] text-bone-700">3 Stripped by Regression</span>
                </div>

                <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center gap-1.5 text-xs text-bone-700 uppercase font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-steel-400" />
                    <span>HALLUCINATION RISK</span>
                  </div>
                  <span className="text-xs font-bold text-ember-600 uppercase">
                    HIGH RISK
                  </span>
                  <span className="text-[10.5px] text-bone-700">Omitted Metadata</span>
                </div>
              </div>

              {/* Target Facts Checklist */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-2.5 font-mono text-xs">
                <span className="font-bold text-bone-700 uppercase tracking-wider text-[11px]">
                  TARGET FACT EXTRACTION AUDIT
                </span>
                <div className="flex flex-col gap-1.5">
                  {groundedFacts.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-bone-300/50">
                      <span className={clsx(f.grounded ? "text-ink-900 font-semibold" : "text-bone-700 line-through")}>
                        {f.fact}
                      </span>
                      <span
                        className={clsx(
                          "px-1.5 py-0.2 rounded-sm text-[10px] font-bold uppercase",
                          f.grounded
                            ? "bg-patina-400/20 text-patina-600"
                            : "bg-ember-600/10 text-ember-600"
                        )}
                      >
                        {f.grounded ? "GROUNDED" : "STRIPPED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL (7 COLS): AI ANSWER ENGINE CONVERSATION LENS ── */}
            <div className="lg:col-span-7 bg-bone-100 border border-bone-300 rounded-sm p-5 sm:p-6 flex flex-col justify-between gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bone-300 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-steel-400" />
                  <span className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wider">
                    AI ANSWER ENGINE LENS SIMULATION
                  </span>
                </div>
                <button
                  onClick={handleReRunTest}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-3 py-1 bg-ember-600 hover:bg-ember-500 text-bone-100 rounded-sm font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-cta"
                >
                  <RefreshCw className={clsx("w-3 h-3 text-bone-100", isTesting && "animate-spin")} />
                  <span>{isTesting ? "QUERYING LLM..." : "RE-TEST SIGNAL"}</span>
                </button>
              </div>

              {/* Conversation Bubble Interface */}
              <div className="flex flex-col gap-4">
                {/* User Query Bubble */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-sm bg-bone-300 text-ink-900 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="bg-bone-300/40 border border-bone-300 rounded-sm p-3.5 max-w-[85%] font-sans text-xs text-ink-900">
                    <span className="font-mono text-[10.5px] font-bold text-bone-700 block mb-1">
                      USER QUERY PROMPT:
                    </span>
                    &ldquo;What are the exact calibration tolerances, MSRP pricing, and housing specifications of the Acme Digital Micrometer Caliper?&rdquo;
                  </div>
                </div>

                {/* AI Model Response Bubble */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-sm bg-ember-600 text-bone-100 flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-cta">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-bone-300/30 border border-bone-300 rounded-sm p-3.5 max-w-[90%] font-mono text-xs text-ink-900 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-bone-700 text-[10.5px]">
                      <span>AI SYNTHESIS (Llama 3.3 70B):</span>
                      <span className="text-ember-600 font-bold">Citation Confidence: 40%</span>
                    </div>

                    <p className="leading-relaxed bg-bone-100 p-2.5 rounded-sm border border-bone-300 text-ink-900">
                      {modelAnswer}
                    </p>

                    {/* Inline Hallucination Alert */}
                    <div className="flex items-center gap-2 bg-ember-600/10 border border-ember-600/40 p-2.5 rounded-sm text-ember-600 text-[11px] font-bold">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>HALLUCINATION ALERT: Engine failed to extract structured Offer pricing entity.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 5-SEGMENT SOURCE FIDELITY INDEX METER ── */}
              <div className="border-t border-bone-300 pt-4 flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink-900 uppercase">
                    SOURCE FIDELITY INDEX
                  </span>
                  <span className="font-bold text-ember-600">
                    {citationScore} / {totalSegments} SEGMENTS GROUNDED
                  </span>
                </div>

                {/* 5-Segment Bar (Filled: patina-400, Empty: bone-300) */}
                <div className="grid grid-cols-5 gap-2 h-3.5">
                  {Array.from({ length: totalSegments }).map((_, idx) => {
                    const isFilled = idx < citationScore;
                    return (
                      <div
                        key={idx}
                        className={clsx(
                          "h-full rounded-sm border transition-all duration-300",
                          isFilled
                            ? "bg-patina-400 border-patina-600"
                            : "bg-bone-300 border-bone-300 opacity-60"
                        )}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-bone-700 pt-1">
                  <span>Level 1: Unverified</span>
                  <span>Level 3: Partial</span>
                  <span>Level 5: Full Grounding</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

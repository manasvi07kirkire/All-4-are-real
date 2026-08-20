"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, XCircle, Sparkles, RefreshCw, Cpu, BookOpen } from "lucide-react";
import { GroundedFactCheck } from "@/lib/geo/citation-test";

interface CitationMeterProps {
  score: number; // 1 to 5
  scorePercent?: number; // 0 to 100
  url: string;
  query?: string;
  modelAnswer?: string;
  modelUsed?: string;
  groundedFacts?: GroundedFactCheck[];
  onReRunTest?: () => Promise<void>;
  isLoading?: boolean;
}

export const CitationMeter: React.FC<CitationMeterProps> = ({
  score = 5,
  scorePercent = 100,
  url,
  query = "What are the core technical specifications and pricing of this product?",
  modelAnswer = "The Digital Micrometer Caliper features a hardened stainless steel housing and ±0.01mm calibration accuracy.",
  modelUsed = "meta-llama/llama-3.3-70b-instruct:free",
  groundedFacts = [
    { fact: "Hardened stainless steel housing", isGrounded: true },
    { fact: "±0.01mm calibration accuracy", isGrounded: true },
    { fact: "IP67 water resistance rating", isGrounded: true },
    { fact: "$149.00 MSRP", isGrounded: true },
    { fact: "Dual LCD digital display", isGrounded: true },
  ],
  onReRunTest,
  isLoading = false,
}) => {
  const [showRawAnswer, setShowRawAnswer] = useState(true);

  // 5 discrete segments
  const totalSegments = 5;

  let meterColor = "bg-patina-400 border-patina-500";
  let textColor = "text-patina-400";
  let statusText = "HIGHLY CITATION-READY";

  if (score <= 2) {
    meterColor = "bg-ember-500 border-ember-600";
    textColor = "text-ember-400";
    statusText = "CITATION FAILURE · ENTITIES STRIPPED";
  } else if (score <= 4) {
    meterColor = "bg-marigold-400 border-marigold-500";
    textColor = "text-marigold-400";
    statusText = "PARTIALLY GROUNDED · AT RISK";
  }

  return (
    <div className="bg-ink-800 border border-line-600 rounded-md p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line-600 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-steel-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-bone-100">
            GEO Citation-Probability Meter
          </span>
          <span className="font-mono text-[10px] text-bone-500 bg-ink-850 px-2 py-0.5 border border-line-600 rounded-sm">
            THE WEDGE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-bone-500">Page:</span>
          <code className="font-mono text-xs text-bone-300 bg-ink-850 px-2 py-0.5 rounded-sm border border-line-600">
            {url}
          </code>
          {onReRunTest && (
            <button
              onClick={onReRunTest}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-ink-750 hover:bg-ink-700 border border-line-500 text-bone-300 hover:text-bone-100 rounded-sm text-xs font-mono transition-all disabled:opacity-50"
            >
              <RefreshCw className={clsx("w-3 h-3", isLoading && "animate-spin text-ember-400")} />
              <span>{isLoading ? "TESTING..." : "LIVE TEST"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Segment Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-2xl font-bold text-bone-100 tabular-nums">
              {score} / 5
            </span>
            <span className="font-mono text-xs text-bone-500">
              ({Math.round((score / 5) * 100)}% grounded)
            </span>
          </div>
          <span className={clsx("font-mono text-xs font-semibold uppercase tracking-wider", textColor)}>
            {statusText}
          </span>
        </div>

        {/* Discrete Segments */}
        <div className="grid grid-cols-5 gap-2 h-5">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isFilled = idx < score;
            return (
              <div
                key={idx}
                className={clsx(
                  "h-full rounded-sm border transition-all duration-300",
                  isFilled
                    ? `${meterColor} shadow-[0_0_8px_rgba(62,140,126,0.2)]`
                    : "bg-ink-850 border-line-600"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Query & Grounded Facts Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Expected Grounding Entities */}
        <div className="flex flex-col gap-2 bg-ink-850 p-3 rounded-sm border border-line-600">
          <span className="font-mono text-[10.5px] font-semibold text-bone-500 uppercase tracking-wider">
            Target Facts / Structured Entities
          </span>
          <div className="flex flex-col gap-1.5">
            {groundedFacts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                {item.isGrounded ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-patina-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-ember-400 shrink-0 mt-0.5" />
                )}
                <span
                  className={clsx(
                    "font-ui",
                    item.isGrounded ? "text-bone-300" : "text-bone-500 line-through"
                  )}
                >
                  {item.fact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Answer Transparency Panel */}
        <div className="flex flex-col gap-2 bg-ink-850 p-3 rounded-sm border border-line-600">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] font-semibold text-bone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-steel-400" />
              <span>AI Answer Engine Output</span>
            </span>
            <span className="font-mono text-[10px] text-bone-500 truncate max-w-[150px]">
              {modelUsed.split("/")[1] || modelUsed}
            </span>
          </div>

          <p className="font-mono text-xs text-bone-300 leading-relaxed bg-ink-900 p-2.5 rounded-sm border border-line-600/80 italic">
            &ldquo;{modelAnswer}&rdquo;
          </p>

          <span className="font-mono text-[10px] text-bone-500 text-right">
            Query: &ldquo;{query.slice(0, 45)}...&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
};

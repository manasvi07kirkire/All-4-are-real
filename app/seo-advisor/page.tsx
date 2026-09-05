"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { FieldManualNav, FieldManualSidebar } from "@/components/layout/FieldManualNav";
import { SuggestionCard } from "@/components/advisor/SuggestionCard";
import { KeywordChip } from "@/components/advisor/KeywordChip";
import { Suggestion } from "@/lib/seo-advisor/types";
import { Sparkles, Search, Loader2 } from "lucide-react";

interface ScanResponse {
  scanId: string;
  pageUrl: string;
  targetKeywords: string[];
  suggestions: Suggestion[];
}

interface ApplyResponse {
  prUrl: string;
  prNumber: number;
}

const CATALOG_PAGES = [
  {
    label: "Digital Micrometer Caliper",
    url: "https://store.acme-industrial.com/products/digital-micrometer-caliper",
    keywords: "precision digital caliper, machinist measuring tool",
  },
  {
    label: "Precision Bench Oscilloscope",
    url: "https://store.acme-industrial.com/products/precision-bench-oscilloscope",
    keywords: "200MHz bench oscilloscope, lab oscilloscope",
  },
  {
    label: "True-RMS Digital Multimeter",
    url: "https://store.acme-industrial.com/products/true-rms-digital-multimeter",
    keywords: "true RMS multimeter, field electrician multimeter",
  },
  {
    label: "Infrared Thermal Imager",
    url: "https://store.acme-industrial.com/products/infrared-thermal-imager",
    keywords: "infrared thermal camera, industrial thermal imager",
  },
  {
    label: "Laser Tachometer",
    url: "https://store.acme-industrial.com/products/laser-tachometer-50000rpm",
    keywords: "non-contact tachometer, 50000 RPM digital tachometer",
  },
];

export default function SeoAdvisorPage() {
  const [pageUrl, setPageUrl] = useState("https://store.acme-industrial.com/products/laser-tachometer-50000rpm");
  const [keywordInput, setKeywordInput] = useState("non-contact tachometer, 50000 RPM digital tachometer");
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingPr, setIsGeneratingPr] = useState(false);
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [prResult, setPrResult] = useState<ApplyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const targetKeywords = keywordInput
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const approvedCount = suggestions.filter((s) => s.status === "approved" || s.status === "applied").length;

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setPrResult(null);
    try {
      const res = await fetch("/api/seo-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageUrl, targetKeywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setScan(data);
      setSuggestions(data.suggestions);
    } catch (err: any) {
      setError(err.message || "Scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  const setStatus = (id: string, status: Suggestion["status"]) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleGeneratePr = async () => {
    if (!scan) return;
    const approvedSuggestionIds = suggestions.filter((s) => s.status === "approved").map((s) => s.id);
    const rejectedSuggestionIds = suggestions.filter((s) => s.status === "rejected").map((s) => s.id);
    if (approvedSuggestionIds.length === 0) return;

    setIsGeneratingPr(true);
    setError(null);
    try {
      const res = await fetch("/api/seo-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: scan.scanId, approvedSuggestionIds, rejectedSuggestionIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate PR");
      setPrResult({ prUrl: data.prUrl, prNumber: data.prNumber });
      setSuggestions((prev) =>
        prev.map((s) => (approvedSuggestionIds.includes(s.id) ? { ...s, status: "applied" } : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to generate PR");
    } finally {
      setIsGeneratingPr(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone-100 text-ink-900 flex flex-col font-sans">
      <FieldManualNav />

      <div className="flex-1 flex w-full">
        <FieldManualSidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-[1300px]">
          {/* Header */}
          <div className="flex flex-col gap-1.5 border-b border-bone-300 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-steel-400 uppercase tracking-widest">
                PRE-DEPLOY
              </span>
              <span className="font-mono text-sm text-bone-700">·</span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-bone-700 truncate">{pageUrl}</span>
            </div>
            <h1 className="font-mono font-black text-2xl sm:text-3xl md:text-4xl text-ink-900 tracking-tight uppercase">
              Optimize Before You Ship
            </h1>
          </div>

          {/* Scan input */}
          <div className="flex flex-col gap-4 bg-bone-100 border border-bone-300 rounded-sm p-4 sm:p-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs sm:text-sm font-bold text-bone-700 uppercase tracking-wider">
                Page URL
              </label>
              <input
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="font-mono text-sm px-3.5 py-2.5 rounded-sm border border-bone-300 bg-bone-100 text-ink-900 focus:outline-none focus:border-steel-400"
                placeholder="https://example.com/product/page"
              />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {CATALOG_PAGES.map((p) => (
                  <button
                    key={p.url}
                    onClick={() => {
                      setPageUrl(p.url);
                      setKeywordInput(p.keywords);
                    }}
                    className="font-mono text-xs px-2.5 py-1 min-h-[32px] rounded-sm border border-bone-300 bg-bone-300/30 text-bone-700 hover:border-steel-400 hover:text-ink-900 transition-all uppercase tracking-wide font-medium"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs sm:text-sm font-bold text-bone-700 uppercase tracking-wider">
                Target keywords
              </label>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="font-mono text-sm px-3.5 py-2.5 rounded-sm border border-bone-300 bg-bone-100 text-ink-900 focus:outline-none focus:border-steel-400"
                placeholder="non-contact tachometer, 50000 RPM digital tachometer"
              />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {targetKeywords.map((k) => (
                  <KeywordChip key={k} label={k} variant="neutral" />
                ))}
              </div>
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning || targetKeywords.length === 0 || !pageUrl}
              className="self-start flex items-center gap-2 px-5 py-2.5 min-h-[40px] bg-steel-400 hover:opacity-90 text-bone-100 rounded-sm font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isScanning ? "Scanning..." : "Re-scan"}</span>
            </button>
          </div>

          {error && (
            <div className="bg-ember-tint border border-ember-600/40 rounded-sm p-3.5 font-mono text-sm text-ember-600">
              {error}
            </div>
          )}

          {prResult && (
            <div className="bg-patina-tint border border-patina-400/40 rounded-sm p-3.5 font-mono text-sm text-patina-600 flex items-center gap-2">
              <span>◆</span>
              <span>
                PR opened:{" "}
                <a href={prResult.prUrl} target="_blank" rel="noreferrer" className="underline font-bold">
                  #{prResult.prNumber}
                </a>{" "}
                — awaiting human review, never auto-merged.
              </span>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-bone-300 pb-2.5 flex-wrap">
                <span className="font-mono text-sm font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-steel-400" />
                  Suggestions ({suggestions.length})
                </span>
                <span className="font-mono text-xs sm:text-sm text-bone-700 font-medium">
                  Grounded in extracted page content · Groq/OpenRouter reasoning
                </span>
              </div>

              {suggestions.map((s) => (
                <SuggestionCard
                  key={s.id}
                  suggestion={s}
                  onApprove={(id) => setStatus(id, "approved")}
                  onReject={(id) => setStatus(id, "rejected")}
                  appliedPrNumber={prResult?.prNumber}
                />
              ))}

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-bone-300">
                <span className="font-mono text-xs text-bone-700 font-semibold">
                  {approvedCount} of {suggestions.length} approved
                </span>
                <button
                  onClick={handleGeneratePr}
                  disabled={isGeneratingPr || approvedCount === 0 || !!prResult}
                  style={{ boxShadow: "0 2px 12px rgba(46, 110, 98, 0.35)" }}
                  className="flex items-center gap-2 px-4 py-2 bg-patina-600 hover:bg-patina-500 text-bone-100 rounded-sm font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {isGeneratingPr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isGeneratingPr ? "Generating..." : "Generate PR →"}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full bg-bone-100 border-t border-bone-300 py-3.5 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-bone-700">
          <div className="flex items-center gap-2">
            <span className="text-ink-900 font-bold">SEARCHOPS_v1.0</span>
            <span>·</span>
            <span>SEO ADVISOR — PRE-DEPLOY OPTIMIZATION</span>
          </div>
          <div>On-page relevance suggestions, never ranking guarantees.</div>
        </div>
      </footer>
    </div>
  );
}

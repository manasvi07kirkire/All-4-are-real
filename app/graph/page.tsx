"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { FieldManualNav, FieldManualSidebar } from "@/components/layout/FieldManualNav";
import {
  Network,
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Layers,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function CrawlerGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>("node-product");
  const [filterType, setFilterType] = useState<"ALL" | "PAGES" | "ERRORS">("ALL");

  const streamLogs = [
    { time: "23:14:02.104", method: "GET", url: "/products/digital-micrometer-caliper", status: 200, latency: "24ms", canonical: "MISSING", alert: true },
    { time: "23:14:01.890", method: "GET", url: "/products/dial-indicator-001", status: 200, latency: "18ms", canonical: "MISSING", alert: true },
    { time: "23:14:00.450", method: "GET", url: "/categories/precision-measuring", status: 200, latency: "31ms", canonical: "OK", alert: false },
    { time: "23:13:58.210", method: "GET", url: "/robots.txt", status: 200, latency: "8ms", canonical: "N/A", alert: false },
    { time: "23:13:55.770", method: "GET", url: "/sitemap.xml", status: 200, latency: "42ms", canonical: "OK", alert: false },
    { time: "23:13:52.120", method: "GET", url: "/products/depth-gauge-pro", status: 404, latency: "12ms", canonical: "ERROR", alert: true },
  ];

  return (
    <div className="min-h-screen bg-bone-100 text-ink-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <FieldManualNav currentDeployNumber={184} />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <FieldManualSidebar />

        {/* Main Content Area: Graph Canvas + Stats/Log Sidebar */}
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
                <span className="text-patina-600 font-bold uppercase tracking-wider">// SCREEN_04</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <h1 className="font-mono font-bold text-2xl sm:text-3xl text-ink-900 tracking-tight">
                  CRAWLER PATH & DISCOVERY TOPOLOGY
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="flex items-center gap-1 bg-bone-300/40 p-0.5 rounded-sm border border-bone-300">
                <button
                  onClick={() => setFilterType("ALL")}
                  className={clsx(
                    "px-2.5 py-1 rounded-sm uppercase font-bold transition-all",
                    filterType === "ALL" ? "bg-ink-900 text-bone-100" : "text-bone-700"
                  )}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterType("PAGES")}
                  className={clsx(
                    "px-2.5 py-1 rounded-sm uppercase font-bold transition-all",
                    filterType === "PAGES" ? "bg-ink-900 text-bone-100" : "text-bone-700"
                  )}
                >
                  PAGES
                </button>
                <button
                  onClick={() => setFilterType("ERRORS")}
                  className={clsx(
                    "px-2.5 py-1 rounded-sm uppercase font-bold transition-all",
                    filterType === "ERRORS" ? "bg-ember-600 text-bone-100" : "text-bone-700"
                  )}
                >
                  IMPACTED
                </button>
              </div>
            </div>
          </div>

          {/* ── 8 COLS / 4 COLS SPLIT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── LEFT: SVG DISCOVERY MAP CANVAS (8 COLS) ── */}
            <div className="lg:col-span-8 bg-bone-100 border border-bone-300 rounded-sm p-4 sm:p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-bone-300 pb-2.5">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-steel-400" />
                  <span className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wider">
                    DISCOVERY MAP & LINK FLOW TOPOLOGY
                  </span>
                </div>
                <span className="font-mono text-[10.5px] text-bone-700 font-bold">
                  ANIMATED CRAWLER VECTOR ENGINE
                </span>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="w-full bg-bone-300/30 border border-bone-300 rounded-sm p-4 h-[420px] relative overflow-hidden flex items-center justify-center">
                {/* Subtle grid */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#6E6353 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <svg className="w-full h-full" viewBox="0 0 600 380">
                  {/* Animated Flow Lines */}
                  {/* Root -> Cat */}
                  <line
                    x1="120"
                    y1="190"
                    x2="280"
                    y2="100"
                    stroke="#4FA695"
                    strokeWidth="2"
                    className="line-active"
                  />
                  {/* Root -> Prod Hub */}
                  <line
                    x1="120"
                    y1="190"
                    x2="280"
                    y2="190"
                    stroke="#C23F10"
                    strokeWidth="2.5"
                    className="line-active"
                  />
                  {/* Root -> Sitemap */}
                  <line
                    x1="120"
                    y1="190"
                    x2="280"
                    y2="280"
                    stroke="#4FA695"
                    strokeWidth="1.5"
                    className="line-active"
                  />
                  {/* Prod Hub -> Caliper Product */}
                  <line
                    x1="280"
                    y1="190"
                    x2="460"
                    y2="140"
                    stroke="#C23F10"
                    strokeWidth="2"
                    className="line-active"
                  />
                  {/* Prod Hub -> Depth Gauge 404 */}
                  <line
                    x1="280"
                    y1="190"
                    x2="460"
                    y2="240"
                    stroke="#C23F10"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                  />

                  {/* Nodes */}
                  {/* 1. Root Node (Pulsing node-active) */}
                  <g className="node-active cursor-pointer" transform="translate(120, 190)">
                    <circle r="22" fill="#100E0C" stroke="#4FA695" strokeWidth="3" />
                    <text textAnchor="middle" dy="4" fill="#F4EDE1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                      ROOT
                    </text>
                  </g>
                  <text x="120" y="226" textAnchor="middle" fill="#100E0C" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    / (Homepage)
                  </text>

                  {/* 2. Category Hub Node */}
                  <g className="cursor-pointer" transform="translate(280, 100)" onClick={() => setSelectedNode("node-cat")}>
                    <circle r="18" fill="#4FA695" stroke="#100E0C" strokeWidth="2" />
                    <text textAnchor="middle" dy="3.5" fill="#F4EDE1" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      CAT
                    </text>
                  </g>
                  <text x="280" y="132" textAnchor="middle" fill="#100E0C" fontSize="10" fontFamily="JetBrains Mono">
                    /categories/*
                  </text>

                  {/* 3. Product Template Emitter Node (Root Cause Emitter) */}
                  <g className="cursor-pointer" transform="translate(280, 190)" onClick={() => setSelectedNode("node-emitter")}>
                    <rect x="-24" y="-18" width="48" height="36" fill="#C23F10" stroke="#100E0C" strokeWidth="2" rx="2" />
                    <text textAnchor="middle" dy="4" fill="#F4EDE1" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      EMITTER
                    </text>
                  </g>
                  <text x="280" y="222" textAnchor="middle" fill="#C23F10" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    ProductPage.tsx:184
                  </text>

                  {/* 4. Sitemap Node */}
                  <g className="cursor-pointer" transform="translate(280, 280)">
                    <circle r="16" fill="#D6CBB8" stroke="#6E6353" strokeWidth="2" />
                    <text textAnchor="middle" dy="3.5" fill="#100E0C" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      XML
                    </text>
                  </g>
                  <text x="280" y="310" textAnchor="middle" fill="#6E6353" fontSize="10" fontFamily="JetBrains Mono">
                    /sitemap.xml
                  </text>

                  {/* 5. Caliper Target Node */}
                  <g className="cursor-pointer" transform="translate(460, 140)" onClick={() => setSelectedNode("node-product")}>
                    <circle r="20" fill="#2A150C" stroke="#C23F10" strokeWidth="2.5" />
                    <text textAnchor="middle" dy="4" fill="#F26A2E" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      PROD
                    </text>
                  </g>
                  <text x="460" y="174" textAnchor="middle" fill="#C23F10" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    /products/caliper (MISSING CANONICAL)
                  </text>

                  {/* 6. Broken 404 Node */}
                  <g className="cursor-pointer" transform="translate(460, 240)">
                    <circle r="16" fill="#C23F10" stroke="#100E0C" strokeWidth="2" />
                    <text textAnchor="middle" dy="3.5" fill="#F4EDE1" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                      404
                    </text>
                  </g>
                  <text x="460" y="270" textAnchor="middle" fill="#C23F10" fontSize="10" fontFamily="JetBrains Mono">
                    /products/depth-gauge (404)
                  </text>
                </svg>
              </div>

              {/* Legend & Stats Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-t border-bone-300 pt-3">
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-patina-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-patina-400 inline-block" />
                    CRAWLED 200 OK
                  </span>
                  <span className="flex items-center gap-1.5 text-ember-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-ember-600 inline-block" />
                    REGRESSED / CANONICAL STRIPPED
                  </span>
                  <span className="flex items-center gap-1.5 text-bone-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-bone-300 inline-block" />
                    PENDING
                  </span>
                </div>

                <div className="text-bone-700 text-[11px]">
                  TOTAL DISCOVERED: <strong className="text-ink-900">142 URLS</strong>
                </div>
              </div>
            </div>

            {/* ── RIGHT: PATH STATS & LIVE STREAM LOG (4 COLS) ── */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Path Statistics Bento Card */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between border-b border-bone-300 pb-2">
                  <span className="text-xs font-bold text-ink-900 uppercase">
                    PATHWAY TELEMETRY
                  </span>
                  <Activity className="w-3.5 h-3.5 text-steel-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-bone-300/40 p-2 rounded-sm border border-bone-300">
                    <span className="text-[10px] text-bone-700 block">DEPTH LEVEL</span>
                    <strong className="text-ink-900 text-sm">3 HOPS</strong>
                  </div>
                  <div className="bg-bone-300/40 p-2 rounded-sm border border-bone-300">
                    <span className="text-[10px] text-bone-700 block">HTTP 200 RATE</span>
                    <strong className="text-patina-600 text-sm">98.6%</strong>
                  </div>
                  <div className="bg-bone-300/40 p-2 rounded-sm border border-bone-300">
                    <span className="text-[10px] text-bone-700 block">ORPHAN NODES</span>
                    <strong className="text-ember-600 text-sm">0</strong>
                  </div>
                  <div className="bg-bone-300/40 p-2 rounded-sm border border-bone-300">
                    <span className="text-[10px] text-bone-700 block">AVG LATENCY</span>
                    <strong className="text-ink-900 text-sm">22ms</strong>
                  </div>
                </div>
              </div>

              {/* Live Crawler Stream Log */}
              <div className="bg-bone-100 border border-bone-300 rounded-sm p-4 flex flex-col justify-between gap-3 font-mono flex-1">
                <div className="flex items-center justify-between border-b border-bone-300 pb-2">
                  <span className="text-xs font-bold text-ink-900 uppercase">
                    LIVE CRAWL STREAM
                  </span>
                  <span className="text-[10px] text-patina-600 bg-patina-400/20 px-1.5 py-0.2 rounded-sm font-bold animate-pulse">
                    LIVE
                  </span>
                </div>

                {/* Log List */}
                <div className="flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1">
                  {streamLogs.map((log, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "p-2 rounded-sm border text-[11px] flex flex-col gap-1 transition-all",
                        log.alert
                          ? "bg-ember-600/10 border-ember-600/30 text-ink-900"
                          : "bg-bone-300/30 border-bone-300 text-bone-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-bone-500 font-bold">{log.time}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={clsx(
                              "px-1.5 py-0.2 rounded-sm font-bold text-[10px]",
                              log.status === 200
                                ? "bg-patina-400/20 text-patina-600"
                                : "bg-ember-600 text-bone-100"
                            )}
                          >
                            {log.status} {log.status === 200 ? "OK" : "404"}
                          </span>
                          <span className="text-[10px] text-bone-700">{log.latency}</span>
                        </div>
                      </div>
                      <div className="truncate font-semibold text-ink-900">
                        {log.url}
                      </div>
                      {log.alert && (
                        <div className="text-[10px] text-ember-600 font-bold uppercase">
                          ⚠ CANONICAL TAG MISSING FROM TEMPLATE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

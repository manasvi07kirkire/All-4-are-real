"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Network, Layers, ShieldAlert, CheckCircle2, Info, ArrowUpRight } from "lucide-react";
import { GraphEdgeData, GraphNodeData } from "@/lib/graph/types";

interface GraphCanvasProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  selectedNodeId?: string;
  onSelectNode?: (node: GraphNodeData) => void;
  className?: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PAGES" | "TEMPLATES" | "REGRESSIONS">("ALL");
  const [hoveredNode, setHoveredNode] = useState<GraphNodeData | null>(null);

  const filteredNodes = nodes.filter((n) => {
    if (activeFilter === "PAGES") return n.type === "page";
    if (activeFilter === "TEMPLATES") return n.type === "template" || n.type === "schema";
    if (activeFilter === "REGRESSIONS") return n.health === "REGRESSION" || n.health === "DEGRADED";
    return true;
  });

  const pageCount = nodes.filter((n) => n.type === "page").length;
  const regressedCount = nodes.filter((n) => n.health === "REGRESSION").length;

  return (
    <div
      className={clsx(
        "bg-ink-850 border border-line-600 rounded-md p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden",
        className
      )}
    >
      {/* Canvas Instrument Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-600 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-steel-400 shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-bone-100">
            Discoverability Graph & Propagation Topology
          </span>
          <span className="font-mono text-[10.5px] text-bone-500 bg-ink-900 px-2 py-0.5 rounded-sm border border-line-600">
            {nodes.length} NODES · {edges.length} RELATIONS
          </span>
        </div>

        {/* Filter Controls - Neutral Hairlines */}
        <div className="flex items-center gap-1 bg-ink-900 p-0.5 rounded-sm border border-line-600 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={clsx(
              "font-mono text-[10.5px] px-2.5 py-0.5 rounded-sm transition-all shrink-0",
              activeFilter === "ALL"
                ? "bg-ink-750 text-bone-100 font-bold border border-line-500"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            ALL ({nodes.length})
          </button>
          <button
            onClick={() => setActiveFilter("PAGES")}
            className={clsx(
              "font-mono text-[10.5px] px-2.5 py-0.5 rounded-sm transition-all shrink-0",
              activeFilter === "PAGES"
                ? "bg-ink-750 text-bone-100 font-bold border border-line-500"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            PAGES ({pageCount})
          </button>
          <button
            onClick={() => setActiveFilter("TEMPLATES")}
            className={clsx(
              "font-mono text-[10.5px] px-2.5 py-0.5 rounded-sm transition-all shrink-0",
              activeFilter === "TEMPLATES"
                ? "bg-ink-750 text-bone-100 font-bold border border-line-500"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            TEMPLATES / SCHEMAS
          </button>
          <button
            onClick={() => setActiveFilter("REGRESSIONS")}
            className={clsx(
              "font-mono text-[10.5px] px-2.5 py-0.5 rounded-sm transition-all shrink-0",
              activeFilter === "REGRESSIONS"
                ? "bg-ink-750 text-ember-400 font-bold border border-ember-500/30"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            IMPACTED ({regressedCount})
          </button>
        </div>
      </div>

      {/* Topology Canvas - 90% Neutral Background with Hairline Precision */}
      <div className="bg-ink-900 border border-line-600 rounded-sm p-4 sm:p-5 min-h-[260px] flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#F4EDE1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Nodes Grid: Neutral hairline cards with color-blind safe status atoms */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredNodes.map((node) => {
            const isRegressed = node.health === "REGRESSION";
            const isDegraded = node.health === "DEGRADED";
            const isRootCauseEmitter = node.key === "ProductPage.tsx" && isRegressed;
            const isSelected = node.id === selectedNodeId;

            // Status Symbol & Label Atom per design.md §5.2
            let statusSymbol = "●";
            let statusLabel = "PASS";
            let statusClass = "text-patina-400";

            if (isRegressed) {
              statusSymbol = "■";
              statusLabel = "REGRESSION";
              statusClass = "text-ember-400";
            } else if (isDegraded) {
              statusSymbol = "▲";
              statusLabel = "DEGRADED";
              statusClass = "text-marigold-400";
            }

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectNode && onSelectNode(node)}
                className={clsx(
                  "p-3 rounded-sm border bg-ink-800 transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer",
                  // Isolated highlight strictly on the Root Cause Emitter or active selected node
                  isRootCauseEmitter
                    ? "border-ember-500/80 bg-ember-tint/20 ring-1 ring-ember-500/40 shadow-sm"
                    : isSelected
                    ? "border-line-500 bg-ink-750 ring-1 ring-line-500"
                    : "border-line-600 hover:border-line-500 hover:bg-ink-750"
                )}
              >
                {/* Card Header: Node Title & Type Chip */}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-mono text-xs font-semibold text-bone-100 truncate">
                    {node.title || node.url}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-bone-500 px-1 py-0.5 bg-ink-900 border border-line-600 rounded-sm shrink-0">
                    {node.type}
                  </span>
                </div>

                {/* Card Subtitle / Path */}
                <div className="text-[11px] font-mono text-bone-500 truncate">
                  <code>{node.url}</code>
                </div>

                {/* Card Footer: Discrete Status Dot Atom (Shape + Label) */}
                <div className="flex items-center justify-between text-[10.5px] font-mono pt-2 border-t border-line-600/50">
                  <span className={clsx("flex items-center gap-1 font-semibold", statusClass)}>
                    <span className="text-[9px] leading-none">{statusSymbol}</span>
                    <span>{statusLabel}</span>
                  </span>

                  {isRootCauseEmitter ? (
                    <span className="text-ember-400 text-[9.5px] font-bold uppercase tracking-wider bg-ember-tint px-1 py-0.5 border border-ember-500/30 rounded-sm">
                      ROOT CAUSE
                    </span>
                  ) : (
                    <span className="text-bone-500 text-[10px]">
                      {node.type === "template" ? "Emitter" : node.type === "schema" ? "Entity" : "Route"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover / Inspection Telemetry Footer */}
        <div className="relative z-10 mt-5 pt-3 border-t border-line-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-bone-400">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-3.5 h-3.5 text-steel-400 shrink-0" />
            {hoveredNode ? (
              <span className="truncate">
                Inspecting: <strong className="text-bone-100">{hoveredNode.url}</strong> (
                {hoveredNode.health}) · Template: {hoveredNode.attrs?.templateName || "None"}
              </span>
            ) : (
              <span>Hover or click any node to trace impact propagation topology</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[10.5px] text-bone-500 shrink-0">
            <span className="flex items-center gap-1">
              <span className="text-patina-400">●</span> Pass
            </span>
            <span className="flex items-center gap-1">
              <span className="text-marigold-400">▲</span> Degraded
            </span>
            <span className="flex items-center gap-1">
              <span className="text-ember-400">■</span> Regression
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

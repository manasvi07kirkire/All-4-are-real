"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Network, Layers, ShieldAlert, CheckCircle2, Info } from "lucide-react";
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
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PAGES" | "REGRESSIONS">("ALL");
  const [hoveredNode, setHoveredNode] = useState<GraphNodeData | null>(null);

  const filteredNodes = nodes.filter((n) => {
    if (activeFilter === "PAGES") return n.type === "page";
    if (activeFilter === "REGRESSIONS") return n.health === "REGRESSION" || n.health === "DEGRADED";
    return true;
  });

  const pageCount = nodes.filter((n) => n.type === "page").length;
  const regressedCount = nodes.filter((n) => n.health === "REGRESSION").length;

  return (
    <div
      className={clsx(
        "bg-ink-900 border border-line-600 rounded-md p-5 flex flex-col gap-4 relative overflow-hidden",
        className
      )}
    >
      {/* Canvas Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-600 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-steel-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-bone-100">
            Discoverability Graph & Impact Propagation
          </span>
          <span className="font-mono text-[10.5px] text-bone-500 bg-ink-850 px-2 py-0.5 rounded-sm border border-line-600">
            {nodes.length} NODES · {edges.length} RELATIONS
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-ink-850 p-1 rounded-sm border border-line-600">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={clsx(
              "font-mono text-[10.5px] px-2 py-0.5 rounded-sm transition-all",
              activeFilter === "ALL"
                ? "bg-ink-750 text-bone-100 font-bold"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            ALL
          </button>
          <button
            onClick={() => setActiveFilter("PAGES")}
            className={clsx(
              "font-mono text-[10.5px] px-2 py-0.5 rounded-sm transition-all",
              activeFilter === "PAGES"
                ? "bg-ink-750 text-bone-100 font-bold"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            PAGES ({pageCount})
          </button>
          <button
            onClick={() => setActiveFilter("REGRESSIONS")}
            className={clsx(
              "font-mono text-[10.5px] px-2 py-0.5 rounded-sm transition-all",
              activeFilter === "REGRESSIONS"
                ? "bg-ember-tint text-ember-400 font-bold border border-ember-500/30"
                : "text-bone-500 hover:text-bone-300"
            )}
          >
            REGRESSIONS ({regressedCount})
          </button>
        </div>
      </div>

      {/* Interactive Node Matrix Visualizer */}
      <div className="bg-ink-850 border border-line-600/80 rounded-sm p-4 min-h-[260px] flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#A2937C 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Nodes Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredNodes.map((node) => {
            const isRegressed = node.health === "REGRESSION";
            const isDegraded = node.health === "DEGRADED";
            const isSelected = node.id === selectedNodeId;

            let borderStyle = "border-line-600 bg-ink-800 text-bone-300";
            let indicator = "bg-patina-400";

            if (isRegressed) {
              borderStyle =
                "border-ember-500/60 bg-ember-tint text-ember-300 animate-pulse shadow-[0_0_12px_rgba(232,83,28,0.2)]";
              indicator = "bg-ember-400";
            } else if (isDegraded) {
              borderStyle = "border-marigold-400/50 bg-marigold-tint text-marigold-300";
              indicator = "bg-marigold-400";
            }

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectNode && onSelectNode(node)}
                className={clsx(
                  "p-2.5 rounded-sm border cursor-pointer transition-all duration-150 flex flex-col justify-between gap-2 hover:border-line-500 hover:scale-[1.02]",
                  borderStyle,
                  isSelected && "ring-2 ring-ember-400 ring-offset-2 ring-offset-ink-900"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={clsx("w-2 h-2 rounded-full shrink-0", indicator)} />
                    <span className="font-mono text-[11px] font-bold truncate">
                      {node.title || node.url}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase text-bone-500 px-1 py-0.2 bg-ink-900 rounded-sm">
                    {node.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-bone-500 pt-1 border-t border-line-600/40">
                  <span className="truncate">{node.url}</span>
                  {isRegressed && <span className="text-ember-400 font-bold shrink-0">■ 0 CANONICAL</span>}
                  {isDegraded && <span className="text-marigold-400 font-bold shrink-0">▲ NO SCHEMA</span>}
                  {!isRegressed && !isDegraded && (
                    <span className="text-patina-400 shrink-0">● OK</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover inspection detail banner */}
        <div className="relative z-10 mt-4 pt-3 border-t border-line-600 flex items-center justify-between text-xs font-mono text-bone-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-steel-400" />
            {hoveredNode ? (
              <span>
                Inspecting: <strong className="text-bone-100">{hoveredNode.url}</strong> (
                {hoveredNode.health})
              </span>
            ) : (
              <span>Hover or click any node to inspect signal propagation paths</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-patina-400" /> Pass
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-marigold-400" /> Degraded
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-ember-400" /> Regression
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

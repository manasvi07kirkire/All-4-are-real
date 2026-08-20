import React from "react";
import clsx from "clsx";
import { classifyRemediationTier, RemediationTier } from "@/lib/remediate/tier-manager";

interface TierBadgeProps {
  tier?: RemediationTier;
  findingType?: any;
  className?: string;
  showDescription?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier = "TIER_A",
  findingType,
  className,
  showDescription = false,
}) => {
  const classification = findingType
    ? classifyRemediationTier(findingType)
    : {
        tier,
        label:
          tier === "TIER_A" ? "AUTO-FIX" : tier === "TIER_B" ? "DRAFT PR" : "APPROVAL ONLY",
        colorToken: tier === "TIER_A" ? "patina" : tier === "TIER_B" ? "marigold" : "ember",
        description:
          tier === "TIER_A"
            ? "Declarative template-safe fix"
            : tier === "TIER_B"
            ? "Structural draft PR"
            : "Requires manual human approval",
      };

  // Symbols: ● patina (Auto-fix), ▲ marigold (Draft PR), ■ ember (Approval)
  const symbol =
    classification.colorToken === "patina"
      ? "●"
      : classification.colorToken === "marigold"
      ? "▲"
      : "■";

  const colorStyles = {
    patina: "text-patina-400 bg-patina-tint border-patina-500/30",
    marigold: "text-marigold-400 bg-marigold-tint border-marigold-400/30",
    ember: "text-ember-400 bg-ember-tint border-ember-500/30",
  }[classification.colorToken];

  return (
    <div className={clsx("inline-flex flex-col items-start gap-1", className)}>
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[11px] font-semibold uppercase tracking-wider",
          colorStyles
        )}
      >
        <span className="text-[9px] leading-none" aria-hidden="true">
          {symbol}
        </span>
        <span>{classification.label}</span>
      </span>
      {showDescription && (
        <span className="font-ui text-xs text-bone-500 max-w-xs">
          {classification.description}
        </span>
      )}
    </div>
  );
};

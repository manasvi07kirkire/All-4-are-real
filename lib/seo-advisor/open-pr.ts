import { Suggestion } from "./types";

// No GitHub App/Octokit integration exists in this codebase yet (lib/github does not exist —
// even the shipped Watch pipeline's PR links are hardcoded strings, see generate-fix/route.ts).
// This mirrors that same pattern until real Octokit wiring is added.
const REPO = "acme-industries/precision-store";

export interface OpenedPr {
  prUrl: string;
  prNumber: number;
  body: string;
}

export function buildPrBody(pageUrl: string, approved: Suggestion[]): string {
  const items = approved
    .map((s) => `- **${s.location}** (${s.type}): ${s.rationale}\n  \`${s.before || "(none)"}\` → \`${s.after}\``)
    .join("\n");

  return `## SEO Advisor: optimize ${pageUrl}

### Applied suggestions (${approved.length})
${items}

### On-page relevance
This is a topical-optimization suggestion set, not a ranking guarantee. Every change above is grounded in this page's real extracted content and the target keywords supplied at scan time.

---
*Opened by SearchOps SEO Advisor — review required, never auto-merged.*`;
}

export function openPullRequest(pageUrl: string, approved: Suggestion[]): OpenedPr {
  const prNumber = 200 + Math.floor(Math.random() * 100);
  return {
    prUrl: `https://github.com/${REPO}/pull/${prNumber}`,
    prNumber,
    body: buildPrBody(pageUrl, approved),
  };
}

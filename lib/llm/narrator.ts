import { openRouter } from "./openrouter";

export interface FindingEvidence {
  pagesAffected: number;
  firstBadDeploy: string;
  template: string;
  sampleUrls?: string[];
}

export interface RootCauseLocation {
  file: string;
  line: number;
  component: string;
}

export interface NarrateFindingInput {
  type: string;
  severity: string;
  confidence: number;
  lens: "search" | "ai-answer" | "both";
  evidence: FindingEvidence;
  rootCause: RootCauseLocation;
}

/**
 * Narrator conforming strictly to AI_RULES.md:
 * Detection and root-cause attribution are pure deterministic code.
 * The LLM only explains and narrates the finding in plain English without inventing facts.
 */
export async function narrateFinding(input: NarrateFindingInput): Promise<{
  narration: string;
  modelUsed: string;
  latencyMs: number;
}> {
  const systemPrompt = `You are the SearchOps Discoverability CI/CD narrator.
You explain precomputed, deterministic regression findings to software engineers.
CRITICAL GOLDEN RULES:
1. Do NOT invent any facts, files, line numbers, page counts, or causes.
2. Only mention the exact file (${input.rootCause.file}), line (${input.rootCause.line}), pages affected (${input.evidence.pagesAffected}), and component (${input.rootCause.component}) provided in the structured evidence.
3. Keep the tone concise, technical, engineer-to-engineer, and direct. Explain the operational impact on search crawlers or AI answer engines.
4. Never promise search rankings or SEO rankings. Refer to 'discoverability', 'machine legibility', or 'citation readiness'.
5. Provide a 2-3 sentence explanation max.`;

  const userPrompt = `Explain this deterministic finding:
- Type: ${input.type}
- Lens: ${input.lens}
- Severity: ${input.severity} (${input.confidence}% confidence)
- Pages Affected: ${input.evidence.pagesAffected}
- First Bad Deployment: ${input.evidence.firstBadDeploy}
- Root Cause File: ${input.rootCause.file} at line ${input.rootCause.line}
- Component: ${input.rootCause.component}`;

  try {
    const result = await openRouter.completeWithFallback([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], { temperature: 0.2, maxTokens: 250 });

    return {
      narration: result.text,
      modelUsed: result.modelUsed,
      latencyMs: result.latencyMs,
    };
  } catch (err: any) {
    return {
      narration: `Commit ${input.evidence.firstBadDeploy} introduced a regression in ${input.rootCause.file}:${input.rootCause.line}, affecting ${input.evidence.pagesAffected} pages. Machine legibility under the ${input.lens} lens is degraded.`,
      modelUsed: "deterministic-template-fallback",
      latencyMs: 0,
    };
  }
}

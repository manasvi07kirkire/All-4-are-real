import { openRouter } from "@/lib/llm/openrouter";
import { AdvisorPageContent, groundedLocations, Suggestion, SuggestionInput, SuggestionType } from "./types";

const VALID_TYPES: SuggestionType[] = [
  "add-keyword",
  "remove-keyword",
  "rewrite-title",
  "rewrite-meta",
  "heading-change",
  "internal-link",
];

interface RawSuggestion {
  type?: string;
  location?: string;
  before?: string;
  after?: string;
  rationale?: string;
  confidence?: number;
}

function buildPrompt(input: SuggestionInput): { system: string; user: string } {
  const locations = groundedLocations(input.content);

  const system = `You are the SearchOps SEO Advisor suggestion engine.
You are given the ACTUAL extracted content of a real page and a list of TARGET KEYWORDS the user wants better represented.
Your job: propose specific, on-page optimization changes.

STRICT GROUNDING RULES (violating these makes a suggestion unusable):
1. Every suggestion's "location" MUST be exactly one of this page's real locations: ${locations.join(", ")}.
2. Every suggestion's "before" MUST be the literal existing text at that location, or "" if the location currently has nothing (e.g. a missing meta description).
3. Never invent a fact, statistic, or claim about the business that is not already present in the extracted content or the supplied target keywords.
4. Only reference the supplied target keywords — never suggest an unrelated keyword.
5. "type" must be one of: ${VALID_TYPES.join(", ")}.
6. "confidence" is an integer 0-100.
7. Return at most 6 suggestions. Keep "rationale" to one short sentence (under 20 words) — brevity matters more than completeness here.
8. Output STRICT JSON only: an array of objects with keys type, location, before, after, rationale, confidence. No markdown fences, no commentary, no surrounding text.`;

  const user = `PAGE URL: ${input.pageUrl}
TARGET KEYWORDS: ${input.targetKeywords.join(", ")}

CURRENT TITLE: ${input.content.title || "(none)"}
CURRENT META DESCRIPTION: ${input.content.metaDescription || "(none)"}
CURRENT H1: ${input.content.headings.h1.join(" | ") || "(none)"}
CURRENT H2s: ${input.content.headings.h2.join(" | ") || "(none)"}
CURRENT PARAGRAPHS:
${input.content.paragraphs.map((p, i) => `paragraph ${i + 1}: ${p}`).join("\n") || "(none)"}
INTERNAL LINK COUNT: ${input.content.internalLinks.length}

Propose grounded on-page suggestions to improve topical relevance for the target keywords above.`;

  return { system, user };
}

function isGrounded(raw: RawSuggestion, content: AdvisorPageContent): raw is Required<RawSuggestion> {
  if (!raw.type || !raw.location || raw.before === undefined || !raw.after || !raw.rationale) return false;
  if (!VALID_TYPES.includes(raw.type as SuggestionType)) return false;
  if (typeof raw.confidence !== "number") return false;
  if (!groundedLocations(content).includes(raw.location)) return false;
  return true;
}

function parseSuggestions(text: string, content: AdvisorPageContent): Suggestion[] {
  let parsed: RawSuggestion[];
  try {
    const jsonSlice = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
    parsed = JSON.parse(jsonSlice || text);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((raw): raw is Required<RawSuggestion> => isGrounded(raw, content))
    .map((raw) => ({
      id: `sug_${Math.random().toString(36).slice(2, 10)}`,
      type: raw.type as SuggestionType,
      location: raw.location,
      before: raw.before,
      after: raw.after,
      rationale: raw.rationale,
      confidence: Math.max(0, Math.min(100, Math.round(raw.confidence))),
      status: "pending" as const,
    }));
}

/**
 * Heuristic, fully-grounded fallback used when no LLM key is configured or the
 * model call fails — every suggestion here is derived directly from the real
 * extracted content, never invented, matching the same grounding discipline
 * required of the LLM path.
 */
function generateHeuristicSuggestions(input: SuggestionInput): Suggestion[] {
  const { content, targetKeywords } = input;
  const suggestions: Suggestion[] = [];
  const bodyText = content.paragraphs.join(" ").toLowerCase();

  const mkId = () => `sug_${Math.random().toString(36).slice(2, 10)}`;

  for (const keyword of targetKeywords) {
    const kw = keyword.trim();
    if (!kw) continue;
    const kwLower = kw.toLowerCase();
    const occursInBody = bodyText.includes(kwLower);

    const title = content.title || "";
    if (!title.toLowerCase().includes(kwLower)) {
      suggestions.push({
        id: mkId(),
        type: "rewrite-title",
        location: "title",
        before: title,
        after: title ? `${title} — ${kw}` : kw,
        rationale: `Target keyword "${kw}" is absent from the page title${occursInBody ? " despite appearing in body copy" : ""}.`,
        confidence: occursInBody ? 78 : 60,
        status: "pending",
      });
    }

    if (content.headings.h1.length > 0) {
      const h1 = content.headings.h1[0];
      const h1Location = content.headings.h1.length === 1 ? "H1" : "H1 #1";
      if (!h1.toLowerCase().includes(kwLower)) {
        suggestions.push({
          id: mkId(),
          type: "heading-change",
          location: h1Location,
          before: h1,
          after: `${h1} — ${kw}`,
          rationale: `Target keyword "${kw}" is absent from H1${occursInBody ? " despite appearing in body copy" : ""}.`,
          confidence: occursInBody ? 82 : 55,
          status: "pending",
        });
      }
    }

    const meta = content.metaDescription || "";
    if (!meta.toLowerCase().includes(kwLower)) {
      suggestions.push({
        id: mkId(),
        type: "rewrite-meta",
        location: "meta description",
        before: meta,
        after: meta ? `${meta} Discover ${kw}.` : `Learn more about ${kw} on this page.`,
        rationale: meta
          ? `Meta description does not mention target keyword "${kw}".`
          : `No meta description is currently set; target keyword "${kw}" is unrepresented in search snippets.`,
        confidence: 65,
        status: "pending",
      });
    }
  }

  return suggestions;
}

export async function generateSuggestions(input: SuggestionInput): Promise<Suggestion[]> {
  const { system, user } = buildPrompt(input);

  const result = await openRouter.completeWithFallback(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.3, maxTokens: 3000, jsonMode: true }
  );

  if (result.isFallback) {
    return generateHeuristicSuggestions(input);
  }

  const parsed = parseSuggestions(result.text, input.content);
  if (parsed.length === 0) {
    console.warn(
      `[SEO Advisor] Model ${result.modelUsed} returned a response that yielded no grounded suggestions after parsing. Falling back to heuristics. Raw response:`,
      result.text.slice(0, 1500)
    );
    return generateHeuristicSuggestions(input);
  }
  return parsed;
}

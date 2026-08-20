import { openRouter } from "../llm/openrouter";

export interface GroundedFactCheck {
  fact: string;
  isGrounded: boolean;
  extractedPhrase?: string;
}

export interface CitationTestResult {
  url: string;
  query: string;
  modelAnswer: string;
  modelUsed: string;
  groundedFacts: GroundedFactCheck[];
  score: number; // 1 to 5 segments
  scorePercent: number; // 0 to 100%
  latencyMs: number;
  totalFacts: number;
}

export interface RunCitationTestInput {
  url: string;
  pageText: string;
  query?: string;
  expectedFacts?: string[];
}

export async function runCitationProbabilityTest(
  input: RunCitationTestInput
): Promise<CitationTestResult> {
  const query =
    input.query ||
    `What are the core technical specifications, features, and pricing details of this product or article?`;

  const expectedFacts = input.expectedFacts || [
    "Stainless steel housing",
    "0.01mm calibration accuracy",
    "$149.00 MSRP",
    "IP67 water resistance rating",
    "Dual LCD display",
  ];

  const systemPrompt = `You are an AI Answer Engine (like ChatGPT Search or Perplexity).
Your task is to answer the user's query STRICTLY AND ONLY using the provided source document text.
If a detail is not in the source text, do not mention or assume it.
Be precise, factual, and concise.`;

  const userPrompt = `SOURCE DOCUMENT TEXT:
"""
${input.pageText.slice(0, 2500)}
"""

QUERY:
${query}

Answer the query using only the facts explicitly present in the document above:`;

  const response = await openRouter.completeWithFallback(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.1, maxTokens: 400 }
  );

  const answerLower = response.text.toLowerCase();

  // Programmatic Grounding Check: compare each expected fact against model answer
  const groundedFacts: GroundedFactCheck[] = expectedFacts.map((fact) => {
    // Check if significant keywords from the fact appear in the answer
    const keywords = fact.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchedCount = keywords.filter((kw) => answerLower.includes(kw)).length;
    const isGrounded = keywords.length > 0 && matchedCount >= Math.ceil(keywords.length * 0.6);

    return {
      fact,
      isGrounded,
    };
  });

  const groundedCount = groundedFacts.filter((f) => f.isGrounded).length;
  const fraction = expectedFacts.length > 0 ? groundedCount / expectedFacts.length : 1;
  const score = Math.max(1, Math.min(5, Math.round(fraction * 5)));
  const scorePercent = Math.round(fraction * 100);

  return {
    url: input.url,
    query,
    modelAnswer: response.text,
    modelUsed: response.modelUsed,
    groundedFacts,
    score,
    scorePercent,
    latencyMs: response.latencyMs,
    totalFacts: expectedFacts.length,
  };
}

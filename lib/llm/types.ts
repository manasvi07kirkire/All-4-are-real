export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface LLMCompletionResult {
  text: string;
  modelUsed: string;
  latencyMs: number;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  isFallback: boolean;
}

// Kept in sync against OpenRouter's live free-tier catalog (many free model slugs
// get renamed/deprecated over time — verify against https://openrouter.ai/api/v1/models
// if this chain starts failing wholesale again). "openrouter/auto" is intentionally
// NOT first: its non-deterministic routing can land on a reasoning model that burns
// the whole token budget on hidden chain-of-thought and returns empty content — it's
// kept as a late fallback instead, behind concrete general-purpose instruct models.
export const FREE_MODELS_CHAIN = [
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "google/gemma-4-26b-a4b-it:free",
  "z-ai/glm-5.2:free",
  "liquid/lfm-2.5-2.6b:free",
  "openrouter/auto",
] as const;

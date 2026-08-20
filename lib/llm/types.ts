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

export const FREE_MODELS_CHAIN = [
  "openrouter/auto",
  "deepseek/deepseek-r1:free",
  "google/gemini-2.0-pro-exp-02-05:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
] as const;

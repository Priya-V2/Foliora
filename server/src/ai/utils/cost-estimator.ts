// Rough, best-effort cost estimate for observability/benchmarking - not a
// billing-accurate figure. Rates are approximate $ per 1M tokens; update
// this table as Gemini pricing changes. Returns null for an unrecognized
// model rather than guessing.
interface ModelRate {
  inputPerMillion: number;
  outputPerMillion: number;
}

const MODEL_RATES: Record<string, ModelRate> = {
  'gemini-2.5-flash': { inputPerMillion: 0.3, outputPerMillion: 2.5 },
  'gemini-2.5-pro': { inputPerMillion: 1.25, outputPerMillion: 10 },
  'gemini-2.0-flash': { inputPerMillion: 0.1, outputPerMillion: 0.4 },
};

export function estimateCost(
  model: string,
  inputTokens: number | null,
  outputTokens: number | null,
): number | null {
  const rate = MODEL_RATES[model];
  if (!rate || inputTokens === null || outputTokens === null) return null;

  const cost =
    (inputTokens / 1_000_000) * rate.inputPerMillion +
    (outputTokens / 1_000_000) * rate.outputPerMillion;

  return Number(cost.toFixed(6));
}

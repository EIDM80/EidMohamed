/**
 * Server-only client for the Jev AI decision API (https://jev-ai.pro).
 *
 * NEVER import this from client/browser code — it reads JEV_AI_API_KEY from
 * process.env and sends it as a Bearer token. It is meant to be called from
 * Vercel serverless functions under /api (see ../../api/jev-urgency.ts) or
 * other server-only code.
 *
 * Retry policy:
 *  - 429 Too Many Requests means the request was rejected before it ran, so
 *    it is safe to wait for Retry-After and retry once automatically
 *    (bounded by `maxAutoRetryAfterSeconds`, default 30s — beyond that we
 *    surface the error instead of blocking the caller).
 *  - 502/504 and network errors/timeouts leave the outcome uncertain. This
 *    client does NOT retry those automatically; the caller decides whether
 *    re-sending is acceptable.
 */

import {
  JevAuthError,
  JevPaymentRequiredError,
  JevRateLimitError,
  JevServiceUnavailableError,
  JevUnexpectedError,
  JevValidationError,
} from "./errors.js";
import type {
  JevModelInfo,
  JevModelsResponse,
  JevSystemOneRequest,
  JevSystemOneResponse,
} from "./types.js";

const BASE_URL = "https://jev-ai.pro/api/v1";

export interface JevClientOptions {
  /** Overrides JEV_AI_API_KEY — mainly for tests. Never hardcode a real key here. */
  apiKey?: string;
  /** Overrides the global fetch — used by tests to mock the network. */
  fetchImpl?: typeof fetch;
  /** Max seconds to honor from a 429 Retry-After before giving up instead of waiting. Default 30. */
  maxAutoRetryAfterSeconds?: number;
}

function resolveApiKey(explicit?: string): string {
  const key = explicit ?? process.env.JEV_AI_API_KEY;
  if (!key) {
    throw new Error(
      "JEV_AI_API_KEY is not set. Configure it as a server-only environment variable " +
        "(see docs/jev-ai-integration.md) — never pass it from browser code.",
    );
  }
  return key;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Reads Retry-After as either delta-seconds or an HTTP date, per RFC 9110 §10.2.3. */
function parseRetryAfter(response: Response): number | undefined {
  const header = response.headers.get("retry-after");
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds);
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) return Math.max(0, Math.round((dateMs - Date.now()) / 1000));
  return undefined;
}

async function throwForStatus(response: Response): Promise<never> {
  const body = await parseJsonSafe(response);
  switch (response.status) {
    case 401:
      throw new JevAuthError(body);
    case 402:
      throw new JevPaymentRequiredError(body);
    case 422:
      throw new JevValidationError(body);
    case 429:
      throw new JevRateLimitError(parseRetryAfter(response), body);
    case 502:
    case 504:
      throw new JevServiceUnavailableError(response.status as 502 | 504, body);
    default:
      throw new JevUnexpectedError(response.status, body);
  }
}

/** Calls POST /api/v1/systemone. See module docs above for the retry policy. */
export async function askJevAI(
  request: JevSystemOneRequest,
  options: JevClientOptions = {},
): Promise<JevSystemOneResponse> {
  const apiKey = resolveApiKey(options.apiKey);
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxAutoRetryAfterSeconds = options.maxAutoRetryAfterSeconds ?? 30;

  const doRequest = (): Promise<Response> =>
    fetchImpl(`${BASE_URL}/systemone`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

  let response: Response;
  try {
    response = await doRequest();
  } catch (cause) {
    throw new Error(
      "Network error calling Jev AI (systemone). The outcome is uncertain — not retried automatically.",
      { cause },
    );
  }

  if (response.status === 429) {
    const retryAfter = parseRetryAfter(response);
    if (retryAfter != null && retryAfter <= maxAutoRetryAfterSeconds) {
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      let retryResponse: Response;
      try {
        retryResponse = await doRequest();
      } catch (cause) {
        throw new Error(
          "Network error retrying Jev AI (systemone) after a 429. The outcome is uncertain — not retried again.",
          { cause },
        );
      }
      if (!retryResponse.ok) await throwForStatus(retryResponse);
      return (await parseJsonSafe(retryResponse)) as JevSystemOneResponse;
    }
    await throwForStatus(response);
  }

  if (!response.ok) await throwForStatus(response);

  return (await parseJsonSafe(response)) as JevSystemOneResponse;
}

/**
 * Calls GET /api/v1/models and returns only entries that look "connected"
 * for this account.
 *
 * UNCONFIRMED: the exact field jev-ai.pro uses to mark a model connected
 * was not verifiable (docs were unreachable from this environment). This
 * checks the common plausible shapes (`connected === true` or
 * `status === "connected"`). Run `npm run jev:live-check` once
 * JEV_AI_API_KEY is configured and adjust `isConnected` below if the real
 * field differs.
 */
export async function getConnectedModels(options: JevClientOptions = {}): Promise<JevModelInfo[]> {
  const apiKey = resolveApiKey(options.apiKey);
  const fetchImpl = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await fetchImpl(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch (cause) {
    throw new Error("Network error calling Jev AI (models).", { cause });
  }

  if (!response.ok) await throwForStatus(response);

  const parsed = (await parseJsonSafe(response)) as JevModelsResponse;
  const models = Array.isArray(parsed?.models) ? parsed.models : [];
  return models.filter(isConnected);
}

function isConnected(model: JevModelInfo): boolean {
  if (model.connected === true) return true;
  if (typeof model.status === "string") return model.status.toLowerCase() === "connected";
  return false;
}

/**
 * Convenience wrapper for a single "noul" (yes/no probability) question —
 * the pattern shown in the integration contract's example payload.
 *
 * Note on Laya models: laya-english caps combined input at 512 tokens and
 * laya-multilingual at 1,024 (per-question). This client does not attempt
 * to pre-count tokens (the exact counting rule — state only vs. state +
 * instructions — wasn't confirmable; docs were unreachable). Keep `state`
 * and `instructions` short when using a Laya model; a violation surfaces
 * as a 422 (JevValidationError) from the API.
 */
export async function askNoulQuestion(params: {
  model?: "jev-latest" | "laya-english" | "laya-multilingual";
  state: string;
  instructions: string;
  options?: JevClientOptions;
}): Promise<number> {
  const { model = "jev-latest", state, instructions, options } = params;
  const response = await askJevAI(
    { model, state, questions: { decision: { type: "noul", instructions } } },
    options,
  );
  const value = response.answers?.decision?.noul;
  if (typeof value !== "number") {
    throw new Error(
      `Jev AI response did not include a numeric answers.decision.noul value: ${JSON.stringify(response.answers)}`,
    );
  }
  return value;
}

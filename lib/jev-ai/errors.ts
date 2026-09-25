/**
 * Typed errors for the Jev AI client (lib/jev-ai/client.ts).
 * Callers should catch these to build "useful errors" per status code
 * rather than branching on response.status themselves.
 */

export class JevAIError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "JevAIError";
    this.status = status;
    this.body = body;
  }
}

export class JevAuthError extends JevAIError {
  constructor(body?: unknown) {
    super("Jev AI rejected the API key (401 Unauthorized). Check JEV_AI_API_KEY.", 401, body);
    this.name = "JevAuthError";
  }
}

export class JevPaymentRequiredError extends JevAIError {
  constructor(body?: unknown) {
    super(
      "Jev AI account requires payment or has insufficient balance (402 Payment Required).",
      402,
      body,
    );
    this.name = "JevPaymentRequiredError";
  }
}

export class JevValidationError extends JevAIError {
  constructor(body?: unknown) {
    super(`Jev AI rejected the request as invalid (422 Unprocessable Entity).${detailFromBody(body)}`, 422, body);
    this.name = "JevValidationError";
  }
}

export class JevRateLimitError extends JevAIError {
  readonly retryAfterSeconds: number | undefined;

  constructor(retryAfterSeconds: number | undefined, body?: unknown) {
    super(
      retryAfterSeconds != null
        ? `Jev AI rate limit hit (429). Retry after ${retryAfterSeconds}s.`
        : "Jev AI rate limit hit (429). No Retry-After header was provided.",
      429,
      body,
    );
    this.name = "JevRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class JevServiceUnavailableError extends JevAIError {
  constructor(status: 502 | 504, body?: unknown) {
    super(
      `Jev AI upstream is unavailable (${status}). The outcome of the request is uncertain — ` +
        "this was not retried automatically.",
      status,
      body,
    );
    this.name = "JevServiceUnavailableError";
  }
}

export class JevUnexpectedError extends JevAIError {
  constructor(status: number, body?: unknown) {
    super(`Jev AI returned an unexpected status ${status}.`, status, body);
    this.name = "JevUnexpectedError";
  }
}

function detailFromBody(body: unknown): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const message = record.message ?? record.error ?? record.detail;
    if (typeof message === "string") return ` ${message}`;
  }
  return "";
}

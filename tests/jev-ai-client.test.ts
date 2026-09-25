import { afterEach, describe, expect, it, vi } from "vitest";

import { askJevAI, askNoulQuestion, getConnectedModels } from "../lib/jev-ai/client.js";
import {
  JevAuthError,
  JevPaymentRequiredError,
  JevRateLimitError,
  JevServiceUnavailableError,
} from "../lib/jev-ai/errors.js";

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

const OPTS = { apiKey: "test-key" };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("askNoulQuestion", () => {
  it("returns the probability from answers.<key>.noul on success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, { answers: { decision: { noul: 0.87 } } }));

    const probability = await askNoulQuestion({
      state: "My payment failed. Please help.",
      instructions: "Does this message need urgent support?",
      options: { ...OPTS, fetchImpl },
    });

    expect(probability).toBe(0.87);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://jev-ai.pro/api/v1/systemone");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({
      model: "jev-latest",
      state: "My payment failed. Please help.",
      questions: { decision: { type: "noul", instructions: "Does this message need urgent support?" } },
    });
  });

  it("throws if answers.<key>.noul is missing or not a number", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, { answers: { decision: {} } }));
    await expect(
      askNoulQuestion({ state: "x", instructions: "y", options: { ...OPTS, fetchImpl } }),
    ).rejects.toThrow(/did not include a numeric/);
  });
});

describe("askJevAI error handling", () => {
  it("maps 401 to JevAuthError", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(401, { message: "invalid key" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toBeInstanceOf(JevAuthError);
  });

  it("maps 402 to JevPaymentRequiredError", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(402, { message: "insufficient balance" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toBeInstanceOf(JevPaymentRequiredError);
  });

  it("maps 422 to JevValidationError and surfaces the body message", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(422, { message: "state is required" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toThrow(/state is required/);
  });

  it("maps 502 to JevServiceUnavailableError and does NOT retry (uncertain outcome)", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(502, { message: "bad gateway" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toBeInstanceOf(JevServiceUnavailableError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("maps 504 to JevServiceUnavailableError and does NOT retry (uncertain outcome)", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(504, { message: "timeout" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toBeInstanceOf(JevServiceUnavailableError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on a network error (uncertain outcome)", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("network down"));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toThrow(/uncertain/);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("on 429 with a short Retry-After, waits then retries once and returns the retry's result", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(429, { message: "slow down" }, { "retry-after": "0" }))
      .mockResolvedValueOnce(jsonResponse(200, { answers: { decision: { noul: 0.4 } } }));

    const result = await askJevAI(
      { model: "jev-latest", state: "s", questions: { decision: { type: "noul", instructions: "i" } } },
      { ...OPTS, fetchImpl },
    );

    expect(result.answers.decision.noul).toBe(0.4);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("on 429 with Retry-After beyond maxAutoRetryAfterSeconds, throws JevRateLimitError without retrying", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(429, { message: "slow down" }, { "retry-after": "9999" }));

    const promise = askJevAI(
      { model: "jev-latest", state: "s", questions: {} },
      { ...OPTS, fetchImpl, maxAutoRetryAfterSeconds: 30 },
    );

    await expect(promise).rejects.toBeInstanceOf(JevRateLimitError);
    await expect(promise).rejects.toMatchObject({ retryAfterSeconds: 9999 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("on 429 with no Retry-After header, throws JevRateLimitError without retrying", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(429, { message: "slow down" }));
    await expect(
      askJevAI({ model: "jev-latest", state: "s", questions: {} }, { ...OPTS, fetchImpl }),
    ).rejects.toMatchObject({ retryAfterSeconds: undefined });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});

describe("getConnectedModels", () => {
  it("filters to only models that look connected", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        models: [
          { id: "jev-latest", connected: true },
          { id: "laya-english", status: "connected" },
          { id: "laya-multilingual", status: "not_connected" },
          { id: "jev-legacy", connected: false },
        ],
      }),
    );

    const models = await getConnectedModels({ ...OPTS, fetchImpl });

    expect(models.map((m) => m.id)).toEqual(["jev-latest", "laya-english"]);
  });

  it("propagates auth errors from GET /models", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(401, { message: "invalid key" }));
    await expect(getConnectedModels({ ...OPTS, fetchImpl })).rejects.toBeInstanceOf(JevAuthError);
  });
});

it("resolveApiKey throws a clear error when JEV_AI_API_KEY is unset and no apiKey override is given", async () => {
  const previous = process.env.JEV_AI_API_KEY;
  delete process.env.JEV_AI_API_KEY;
  try {
    await expect(askJevAI({ model: "jev-latest", state: "s", questions: {} })).rejects.toThrow(
      /JEV_AI_API_KEY is not set/,
    );
  } finally {
    if (previous !== undefined) process.env.JEV_AI_API_KEY = previous;
  }
});

/**
 * POST /api/jev-urgency
 *
 * The server-side integration point for the Jev AI decision API. Takes a
 * free-text message and returns whether it needs urgent support, per the
 * "noul" question pattern from the integration contract:
 *   { model: "jev-latest", state: <message>, questions: { urgent: { type: "noul", ... } } }
 *
 * JEV_AI_API_KEY is read server-side only (lib/jev-ai/client.ts) — this
 * route never sends it to, or accepts it from, the client.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { askNoulQuestion } from "../lib/jev-ai/client.js";
import {
  JevAIError,
  JevAuthError,
  JevPaymentRequiredError,
  JevRateLimitError,
  JevServiceUnavailableError,
} from "../lib/jev-ai/errors.js";

interface RequestBody {
  message?: unknown;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const body = req.body as RequestBody | undefined;
  const message = body?.message;
  if (typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Request body must include a non-empty string field: message." });
    return;
  }

  try {
    const probability = await askNoulQuestion({
      model: "jev-latest",
      state: message,
      instructions: "Does this message need urgent support?",
    });
    res.status(200).json({ urgent: probability > 0.5, probability });
  } catch (error) {
    handleJevError(error, res);
  }
}

function handleJevError(error: unknown, res: VercelResponse): void {
  if (error instanceof JevAuthError || error instanceof JevPaymentRequiredError) {
    // Our own credential/billing problem — never expose that detail publicly.
    console.error("[jev-urgency] Jev AI account problem:", error.message);
    res.status(500).json({ error: "This service is temporarily misconfigured. Please try again later." });
    return;
  }

  if (error instanceof JevRateLimitError) {
    if (error.retryAfterSeconds != null) {
      res.setHeader("Retry-After", String(error.retryAfterSeconds));
    }
    res.status(429).json({ error: "Rate limited by Jev AI. Please retry shortly.", retryAfterSeconds: error.retryAfterSeconds });
    return;
  }

  if (error instanceof JevServiceUnavailableError) {
    res.status(502).json({ error: "Jev AI is temporarily unavailable. Please try again shortly." });
    return;
  }

  if (error instanceof JevAIError) {
    // Includes 422 validation errors — pass the status through as-is.
    res.status(error.status).json({ error: error.message });
    return;
  }

  console.error("[jev-urgency] Unexpected error:", error);
  res.status(500).json({ error: "Unexpected error contacting Jev AI." });
}

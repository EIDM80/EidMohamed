/**
 * GET /api/jev-models
 *
 * Lists only the Jev AI models connected/available for this account, per
 * the integration contract ("If this project needs model selection, call
 * authenticated GET /api/v1/models and show only the connected models").
 * Server-side only — never exposes JEV_AI_API_KEY.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { getConnectedModels } from "../lib/jev-ai/client.js";
import { JevAIError, JevAuthError, JevPaymentRequiredError, JevRateLimitError } from "../lib/jev-ai/errors.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  try {
    const models = await getConnectedModels();
    res.status(200).json({ models });
  } catch (error) {
    if (error instanceof JevAuthError || error instanceof JevPaymentRequiredError) {
      console.error("[jev-models] Jev AI account problem:", error.message);
      res.status(500).json({ error: "This service is temporarily misconfigured. Please try again later." });
      return;
    }
    if (error instanceof JevRateLimitError) {
      if (error.retryAfterSeconds != null) res.setHeader("Retry-After", String(error.retryAfterSeconds));
      res.status(429).json({ error: "Rate limited by Jev AI. Please retry shortly." });
      return;
    }
    if (error instanceof JevAIError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("[jev-models] Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error contacting Jev AI." });
  }
}

/**
 * Manual live verification for the Jev AI integration.
 *
 * NOT run automatically — run it yourself once JEV_AI_API_KEY is configured:
 *   JEV_AI_API_KEY=... npx tsx scripts/jev-live-check.ts
 * or, with the key in .env.local:
 *   npx tsx --env-file=.env.local scripts/jev-live-check.ts
 *
 * Makes exactly one GET /api/v1/models call and one POST /api/v1/systemone
 * call (the example payload from the integration contract), and prints the
 * result. Never prints the API key.
 */

import { askJevAI, getConnectedModels } from "../lib/jev-ai/client.js";

async function main(): Promise<void> {
  if (!process.env.JEV_AI_API_KEY) {
    console.error("JEV_AI_API_KEY is not set. See docs/jev-ai-integration.md.");
    process.exitCode = 1;
    return;
  }

  console.log("Fetching connected models (GET /api/v1/models)...");
  const models = await getConnectedModels();
  console.log(`Connected models: ${models.map((m) => m.id ?? m.name ?? JSON.stringify(m)).join(", ") || "(none)"}`);

  console.log("\nAsking a test urgency question (POST /api/v1/systemone, model=jev-latest)...");
  const response = await askJevAI({
    model: "jev-latest",
    state: "My payment failed. Please help.",
    questions: { urgent: { type: "noul", instructions: "Does this message need urgent support?" } },
  });

  console.log("answers.urgent.noul:", response.answers?.urgent?.noul);
  console.log("usage:", response.usage ?? "(not present in response)");
}

main().catch((error) => {
  console.error("Live check failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

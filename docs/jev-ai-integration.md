# Jev AI integration

Server-side client + Vercel API routes for the Jev AI decision API
(https://jev-ai.pro). The key lives only in server-side environment
variables — never in browser code, git history, or logs.

## Files

- `lib/jev-ai/client.ts` — typed client: `askJevAI`, `askNoulQuestion`, `getConnectedModels`.
- `lib/jev-ai/types.ts`, `lib/jev-ai/errors.ts` — request/response types and typed errors per status code.
- `api/jev-urgency.ts` — `POST /api/jev-urgency { message }` → `{ urgent, probability }`, the example integration point (noul question, model `jev-latest`).
- `api/jev-models.ts` — `GET /api/jev-models` → connected models only.
- `tests/jev-ai-client.test.ts` — mocked-fetch tests for the client (success, 401/402/422/429/502/504, Retry-After, no-retry-on-uncertain-outcome).
- `scripts/jev-live-check.ts` — manual, one-shot live verification (not run automatically).

## ⚠️ What's confirmed vs. inferred

`jev-ai.pro/docs` was unreachable from the environment this was built in
(network egress to that domain is blocked there). Confirmed against the
contract you gave: the `systemone` request shape, the `noul` answer field,
error status codes, and `Retry-After`. **Not confirmed** — inferred
best-effort and marked with comments in `lib/jev-ai/types.ts` /
`client.ts`:

- The response field names for `"choice"` and `"score"` questions.
- The shape of the `usage` object.
- The exact field `/api/v1/models` uses to mark a model "connected" (currently checks `connected === true` or `status === "connected"`).

Run `npm run jev:live-check` (below) once you have a key and diff the real
response against these — tell me if anything differs and I'll fix the types.

## Configure the API key

### Local development

1. `cp .env.example .env.local`
2. Put your real key in `.env.local`: `JEV_AI_API_KEY=...`
3. `.env.local` is gitignored — it will never be committed.
4. `vercel dev` picks up `.env.local` automatically. For running scripts directly, either:
   - `npx tsx --env-file=.env.local scripts/jev-live-check.ts`, or
   - `JEV_AI_API_KEY=... npx tsx scripts/jev-live-check.ts`

### Deployment (Vercel)

1. Vercel Dashboard → your project → **Settings → Environment Variables**.
2. Add `JEV_AI_API_KEY`, mark it **Sensitive**, scope it to Production (and Preview if you want PRs to hit the real API).
3. Redeploy. The two API routes (`/api/jev-urgency`, `/api/jev-models`) read it server-side only — it's never sent to the browser.

**Do not paste the key into chat, commits, or logs.** The client and API routes never `console.log` it.

## Install & test

```bash
npm install
npm test
```

Tests mock `fetch` (via `fetchImpl` dependency injection) — no network calls, no API key needed to run them.

## One minimal live call, once your key is configured

```bash
npx tsx --env-file=.env.local scripts/jev-live-check.ts
```

This does exactly two real calls:
1. `GET /api/v1/models` → prints the connected model IDs.
2. `POST /api/v1/systemone` with the example payload (`model: "jev-latest"`, the "My payment failed" message, one `noul` question) → prints `answers.urgent.noul` and `usage` (if present).

If it fails, the error will be one of the typed errors above (401/402/422/429/502/504) with a specific message — that tells you exactly what to fix (bad key, no balance, rate limited, etc.).

## Laya models

`laya-english` and `laya-multilingual` are supported on the same `/systemone` endpoint and key. Per-question input caps: 512 tokens (english) / 1,024 tokens (multilingual) — keep `state` + `instructions` short. The client does not pre-count tokens (the exact counting rule wasn't confirmable from the unreachable docs); a violation will come back as a 422 (`JevValidationError`) with the API's own message.
